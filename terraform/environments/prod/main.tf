terraform {
  cloud {
    organization = "CareUCE"
    workspaces {
      name = "careuce-prod-jimmy"
    }
  }
}

# 1. Red Multi-AZ
module "vpc" {
  source      = "../../modules/vpc"
  environment = var.environment
}

# 2. Grupos de Seguridad (Segregación de roles)
resource "aws_security_group" "alb_sg" {
  name   = "careuce-alb-sg"
  vpc_id = module.vpc.vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "bastion_sg" {
  name   = "careuce-bastion-sg"
  vpc_id = module.vpc.vpc_id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # SSH desde internet
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "app_sg" {
  name   = "careuce-app-sg"
  vpc_id = module.vpc.vpc_id

  # Solo permite tráfico web desde el Load Balancer
  ingress {
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_sg.id]
  }

  # Solo permite SSH desde el Bastion Host
  ingress {
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion_sg.id]
  }

  ingress {
    from_port = 5432
    to_port   = 5432
    protocol  = "tcp"
    self      = true # 'self' significa que permite tráfico desde este mismo Security Group
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# 🔥 NUEVO: Security Group dedicado para los servicios de datos con estado
# (Kafka + MongoDB). Viven en una sola instancia separada del ASG porque
# NO deben duplicarse cada vez que el Auto Scaling Group escala: si cada
# nodo levantara su propio Kafka/Mongo tendríamos varios clusters
# desincronizados en lugar de un backend compartido.
resource "aws_security_group" "data_sg" {
  name   = "careuce-data-sg"
  vpc_id = module.vpc.vpc_id

  # Kafka: solo alcanzable desde las instancias de aplicación (clinical-service, triage-service)
  ingress {
    from_port       = 9092
    to_port         = 9092
    protocol        = "tcp"
    security_groups = [aws_security_group.app_sg.id]
  }

  # MongoDB: solo alcanzable desde las instancias de aplicación (clinical-service)
  ingress {
    from_port       = 27017
    to_port         = 27017
    protocol        = "tcp"
    security_groups = [aws_security_group.app_sg.id]
  }

  # SSH solo desde el Bastion, para poder depurar Kafka/Mongo si hace falta
  ingress {
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# 3. Balanceador de Carga
module "alb" {
  source            = "../../modules/alb"
  environment       = var.environment
  vpc_id            = module.vpc.vpc_id
  public_subnet_ids = module.vpc.public_subnet_ids
  security_group_id = aws_security_group.alb_sg.id
}

# 4. Bastion Host (Jumpbox en subred pública para acceso seguro)
resource "aws_instance" "bastion" {
  ami                         = "ami-0c7217cdde317cfec"
  instance_type               = "t2.micro" # Pequeño porque solo es para hacer puente SSH
  subnet_id                   = module.vpc.public_subnet_ids[0]
  vpc_security_group_ids      = [aws_security_group.bastion_sg.id]
  associate_public_ip_address = true
  iam_instance_profile        = "LabInstanceProfile"
  tags = { Name = "CareUCE-PROD-Bastion" }
}

# 🔥 NUEVO: Instancia dedicada para Kafka (KRaft, single-node) + MongoDB.
# Vive en subred privada; solo el ASG de aplicación puede hablarle (data_sg),
# y solo el Bastion puede entrar por SSH.
resource "aws_instance" "data_services" {
  ami                    = "ami-0c7217cdde317cfec"
  instance_type          = "t3.medium"
  subnet_id              = module.vpc.private_subnet_ids[0]
  vpc_security_group_ids = [aws_security_group.data_sg.id]
  iam_instance_profile   = "LabInstanceProfile"

  # 🔥 FIX: sin esto, Terraform NO recrea la instancia cuando cambia
  # user_data (solo actualiza el atributo, pero una instancia ya viva no
  # vuelve a correr cloud-init). Con esto, cualquier cambio futuro al
  # script sí se aplica de verdad.
  user_data_replace_on_change = true

  user_data = base64encode(<<-EOF
              #!/bin/bash
              # 🔥 FIX: log completo para poder depurar con
              # `cat /var/log/user-data.log` en vez de adivinar
              exec > /var/log/user-data.log 2>&1
              set -x

              # 🔥 FIX: apt-daily/unattended-upgrades puede tener el lock de
              # dpkg tomado justo al arrancar; -o DPkg::Lock::Timeout hace que
              # apt-get espere en vez de fallar de inmediato
              apt-get -o DPkg::Lock::Timeout=120 update -y
              apt-get -o DPkg::Lock::Timeout=120 install -y docker.io docker-compose-v2
              systemctl enable docker
              systemctl start docker
              usermod -aG docker ubuntu

              # 🔥 FIX: 'systemctl start docker' retorna en cuanto el unit systemd
              # arranca, pero el socket de la API de Docker puede tardar unos
              # segundos más en estar listo. Sin esta espera, 'docker run'
              # puede fallar a mitad de arranque del daemon y dejar el
              # contenedor atascado en estado "Created" para siempre (nunca
              # llega a "Up", y --restart=always no ayuda porque esa política
              # solo aplica DESPUES de un arranque exitoso).
              for i in $(seq 1 30); do
                docker info >/dev/null 2>&1 && break
                sleep 2
              done

              docker network create careuce-data-network

              # Kafka en modo KRaft (sin Zookeeper), igual que en QA
              docker run -d --name kafka \
                --network careuce-data-network --restart always \
                -p 9092:9092 \
                -e KAFKA_NODE_ID=1 \
                -e KAFKA_PROCESS_ROLES=controller,broker \
                -e KAFKA_LISTENERS=PLAINTEXT://0.0.0.0:9092,CONTROLLER://0.0.0.0:9093 \
                -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://$(curl -s http://169.254.169.254/latest/meta-data/local-ipv4):9092 \
                -e KAFKA_LISTENER_SECURITY_PROTOCOL_MAP=CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT \
                -e KAFKA_CONTROLLER_QUORUM_VOTERS=1@kafka:9093 \
                -e KAFKA_CONTROLLER_LISTENER_NAMES=CONTROLLER \
                -e KAFKA_AUTO_CREATE_TOPICS_ENABLE=true \
                -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 \
                apache/kafka:3.8.0

              # MongoDB para clinical-service
              docker run -d --name mongodb \
                --network careuce-data-network --restart always \
                -p 27017:27017 \
                -v /home/ubuntu/mongo-data:/data/db \
                mongo:6.0
              EOF
  )

  tags = { Name = "CareUCE-PROD-DataServices" }
}

# 5. Plantilla y Grupo de Autoescalado (Instancias en subredes privadas)
resource "aws_launch_template" "app" {
  name_prefix   = "careuce-prod-template"
  image_id      = "ami-0c7217cdde317cfec"
  instance_type = var.instance_type
  vpc_security_group_ids = [aws_security_group.app_sg.id]
  iam_instance_profile { name = "LabInstanceProfile" }

  user_data = base64encode(<<-EOF
              #!/bin/bash
              exec > /var/log/user-data.log 2>&1
              set -x

              apt-get -o DPkg::Lock::Timeout=120 update -y
              apt-get -o DPkg::Lock::Timeout=120 install -y docker.io docker-compose-v2
              systemctl enable docker
              systemctl start docker
              usermod -aG docker ubuntu
 
              # 🔥 FIX: esperar a que el daemon de Docker esté realmente listo
              for i in $(seq 1 30); do
                docker info >/dev/null 2>&1 && break
                sleep 2
              done
 
              # 1. Crear red privada
              docker network create careuce-prod-network
               docker network create careuce-prod-network

              # 2. Iniciar Auth Service
              docker run -d --name auth-service \
                --network careuce-prod-network --restart always \
                -e PORT="3000" -e NODE_ENV="production" \
                -e DB_HOST="${aws_db_instance.auth_db.address}" \
                -e DB_PORT="5432" \
                -e DB_USER="${aws_db_instance.auth_db.username}" \
                -e DB_PASSWORD="${aws_db_instance.auth_db.password}" \
                -e DB_NAME="${aws_db_instance.auth_db.db_name}" \
                -e JWT_SECRET="${var.jwt_secret}" \
                cvrobayo/careuce-auth:prod

              # 3. Iniciar Triage Service
              docker run -d --name triage-service \
                --network careuce-prod-network --restart always \
                -e PORT="3000" -e NODE_ENV="production" \
                -e TRIAGE_DB_HOST="${aws_db_instance.triage_db.address}" \
                -e TRIAGE_DB_PORT="5432" \
                -e TRIAGE_DB_USER="${aws_db_instance.triage_db.username}" \
                -e TRIAGE_DB_PASSWORD="${aws_db_instance.triage_db.password}" \
                -e TRIAGE_DB_NAME="${aws_db_instance.triage_db.db_name}" \
                -e JWT_SECRET="${var.jwt_secret}" \
                -e KAFKA_BROKER="${aws_instance.data_services.private_ip}:9092" \
                cvrobayo/careuce-triage:prod

              # 🔥 NUEVO: Iniciar Clinical Service (consumidor Kafka puro, sin puerto HTTP)
              docker run -d --name clinical-service \
                --network careuce-prod-network --restart always \
                -e NODE_ENV="production" \
                -e KAFKA_BROKER="${aws_instance.data_services.private_ip}:9092" \
                -e MONGO_URI="mongodb://${aws_instance.data_services.private_ip}:27017/clinical_db" \
                cvrobayo/careuce-clinical:prod

              # 🔥 NUEVO: Iniciar Appointment Service
              docker run -d --name appointment-service \
                --network careuce-prod-network --restart always \
                -e PORT="3000" -e NODE_ENV="production" \
                -e APPOINTMENT_DB_HOST="${aws_db_instance.appointment_db.address}" \
                -e APPOINTMENT_DB_PORT="5432" \
                -e APPOINTMENT_DB_USER="${aws_db_instance.appointment_db.username}" \
                -e APPOINTMENT_DB_PASSWORD="${aws_db_instance.appointment_db.password}" \
                -e APPOINTMENT_DB_NAME="${aws_db_instance.appointment_db.db_name}" \
                cvrobayo/careuce-appointment:prod

              # 🔥 NUEVO: Iniciar Frontend Web (React SPA vía Nginx). Rutas relativas
              # (/api) porque se sirve desde el mismo Gateway Nginx que la API.
              docker run -d --name web \
                --network careuce-prod-network --restart always \
                cvrobayo/careuce-web:prod

              # 4. Crear Nginx Config (Con Health Check y Proxy Headers) - Mismo
              # enrutamiento que nginx/nginx.conf usado en QA
              mkdir -p /home/ubuntu/nginx
              cat << 'NGINX_CONF' > /home/ubuntu/nginx/nginx.conf
               events { worker_connections 1024; }
               http {
                   # 🔥 FIX: por defecto nginx resuelve los hostnames de los
                   # 'proxy_pass' UNA SOLA VEZ al arrancar (DNS estático). Si un
                   # contenedor (p.ej. appointment-service) todavía no existe en
                   # el DNS interno de Docker en ese instante, nginx se niega a
                   # arrancar POR COMPLETO con "host not found in upstream",
                   # tumbando el gateway entero por un solo servicio lento.
                   # Con 'resolver' + variables, la resolución se hace en cada
                   # request (perezosa), así que nginx arranca siempre, y si un
                   # servicio puntual no está listo esa ruta específica
                   # responde 502 en vez de tumbar todo el gateway.
                   resolver 127.0.0.11 valid=10s;
 
                   server {
                       listen 80;
 
                       # Frontend Web (React SPA). Esta misma ruta "/" también sirve
                       # de health check para el ALB (el contenedor web responde 200).
                       location / {
                           set $upstream_web http://web:80;
                           proxy_pass $upstream_web;
                           proxy_set_header Host $host;
                           proxy_set_header X-Real-IP $remote_addr;
                           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                       }
 
                       location /api/auth {
                           set $upstream_auth http://auth-service:3000;
                           proxy_pass $upstream_auth;
                           proxy_set_header Host $host;
                           proxy_set_header X-Real-IP $remote_addr;
                           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                       }
 
                       location /api/triage {
                           set $upstream_triage http://triage-service:3000;
                           proxy_pass $upstream_triage;
                           proxy_set_header Host $host;
                           proxy_set_header X-Real-IP $remote_addr;
                           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                       }
 
                       location /api/clinical {
                           set $upstream_clinical http://clinical-service:3000;
                           proxy_pass $upstream_clinical;
                           proxy_set_header Host $host;
                           proxy_set_header X-Real-IP $remote_addr;
                           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                       }
 
                       location /api/appointments {
                           set $upstream_appointments http://appointment-service:3000;
                           proxy_pass $upstream_appointments;
                           proxy_set_header Host $host;
                           proxy_set_header X-Real-IP $remote_addr;
                           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                      }
                  }
              }
              NGINX_CONF

              # 5. Iniciar Nginx
              docker run -d -p 80:80 --name api-gateway \
                --network careuce-prod-network --restart always \
                -v /home/ubuntu/nginx/nginx.conf:/etc/nginx/nginx.conf:ro \
                nginx:alpine
              EOF
  )
}

resource "aws_autoscaling_group" "app_asg" {
  name                = "careuce-prod-asg"
  vpc_zone_identifier = module.vpc.private_subnet_ids
  target_group_arns   = [module.alb.target_group_arn]

  # Límites estrictos para respetar las reglas de AWS Academy (32 vCPUs maximo)
  desired_capacity    = 2 # Iniciamos con 2 máquinas (1 en cada zona de disponibilidad)
  min_size            = 2 # Nunca debe haber menos de 2 máquinas (Alta Disponibilidad real)
  max_size            = 4 # Si hay crisis, escalará hasta 4 (8 vCPUs en total, muy seguro)

  launch_template {
    id      = aws_launch_template.app.id
    version = "$Latest"
  }

  # FIX: Esta etiqueta le dará nombre visual a las máquinas en la consola de AWS EC2
  tag {
    key                 = "Name"
    value               = "CareUCE-PROD-Node"
    propagate_at_launch = true
  }
}

# 6. Políticas de Autoescalado Dinámico (Alta Criticidad)

# Política 1: Prevención de Colapso por Saturación de Procesamiento (CPU)
resource "aws_autoscaling_policy" "cpu_policy" {
  name                   = "careuce-cpu-scaling-policy"
  autoscaling_group_name = aws_autoscaling_group.app_asg.name
  policy_type            = "TargetTrackingScaling"

  target_tracking_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ASGAverageCPUUtilization"
    }
    target_value = 65.0 # Actúa de forma preventiva antes de llegar al 100%
  }
}

# Política 2: Prevención de Colapso por Picos de Tráfico (Peticiones Concurrentes)
resource "aws_autoscaling_policy" "requests_policy" {
  name                   = "careuce-requests-scaling-policy"
  autoscaling_group_name = aws_autoscaling_group.app_asg.name
  policy_type            = "TargetTrackingScaling"

  target_tracking_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ALBRequestCountPerTarget"
      # Conecta la métrica específicamente a nuestro ALB y Target Group
      resource_label         = "${module.alb.alb_arn_suffix}/${module.alb.target_group_arn_suffix}"
    }
    # Si una instancia está recibiendo más de 500 peticiones en el periodo de evaluación, escala
    target_value = 500.0 
  }
}

# Output: Este es el DNS estático de Producción (La URL que nunca cambia)
output "production_url" {
  description = "URL publica del Load Balancer de Produccion"
  value       = module.alb.alb_dns_name
}


# RDS para los microservicios con base de datos relacional

# Crear la Subnet Group para RDS (para que sepa en qué subredes privadas vivir)
resource "aws_db_subnet_group" "db_subnet" {
  name       = "careuce-db-subnet"
  subnet_ids = module.vpc.private_subnet_ids
}

# Crear la Base de Datos PostgreSQL - auth-service
resource "aws_db_instance" "auth_db" {
  identifier             = "careuce-auth-db-prod"
  engine                 = "postgres"
  engine_version         = "15"
  instance_class         = "db.t3.micro" # Capa gratuita / bajo costo
  allocated_storage      = 20
  storage_encrypted      = true
  db_name                = "auth_db_prod"
  username               = "postgres"
  password               = var.auth_db_password
  db_subnet_group_name   = aws_db_subnet_group.db_subnet.name
  vpc_security_group_ids = [aws_security_group.app_sg.id]
  skip_final_snapshot    = true
  backup_retention_period = 7

  # Persistencia de la db
  lifecycle {
    prevent_destroy = true
  }
}

# Crear la Base de Datos PostgreSQL para Triage
resource "aws_db_instance" "triage_db" {
  identifier             = "careuce-triage-db-prod"
  engine                 = "postgres"
  engine_version         = "15"
  instance_class         = "db.t3.micro"
  allocated_storage      = 20
  storage_encrypted      = true
  db_name                = "triage_db_prod"
  username               = "postgres"
  password               = var.triage_db_password
  db_subnet_group_name   = aws_db_subnet_group.db_subnet.name
  vpc_security_group_ids = [aws_security_group.app_sg.id]
  skip_final_snapshot    = true
  backup_retention_period = 7

  lifecycle {
    prevent_destroy = true
  }
}

# 🔥 NUEVO: Base de Datos PostgreSQL para Appointment Service
resource "aws_db_instance" "appointment_db" {
  identifier             = "careuce-appointment-db-prod"
  engine                 = "postgres"
  engine_version         = "15"
  instance_class         = "db.t3.micro"
  allocated_storage      = 20
  storage_encrypted      = true
  db_name                = "appointment_db_prod"
  username               = "postgres"
  password               = var.appointment_db_password
  db_subnet_group_name   = aws_db_subnet_group.db_subnet.name
  vpc_security_group_ids = [aws_security_group.app_sg.id]
  skip_final_snapshot    = true
  backup_retention_period = 7

  lifecycle {
    prevent_destroy = true
  }
}

# Outputs para que Terraform entregue las URLs exactas al terminar
output "rds_endpoint" {
  description = "URL de conexión de la base de datos de Producción - auth-service"
  value       = aws_db_instance.auth_db.endpoint
}

output "appointment_rds_endpoint" {
  description = "URL de conexión de la base de datos de Producción - appointment-service"
  value       = aws_db_instance.appointment_db.endpoint
}

output "data_services_private_ip" {
  description = "IP privada de la instancia de Kafka + MongoDB (solo accesible dentro de la VPC)"
  value       = aws_instance.data_services.private_ip
}
