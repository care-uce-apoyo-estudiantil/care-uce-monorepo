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

# 5. Plantilla y Grupo de Autoescalado (Instancias en subredes privadas)
resource "aws_launch_template" "app" {
  name_prefix   = "careuce-prod-template"
  image_id      = "ami-0c7217cdde317cfec"
  instance_type = var.instance_type
  vpc_security_group_ids = [aws_security_group.app_sg.id]
  iam_instance_profile { name = "LabInstanceProfile" }

  user_data = base64encode(<<-EOF
              #!/bin/bash
              apt-get update -y
              apt-get install -y docker.io docker-compose
              systemctl enable docker
              systemctl start docker
              usermod -aG docker ubuntu
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