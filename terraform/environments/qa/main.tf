# Configuración del Backend Remoto (HCP Terraform)
terraform {
  cloud {
    organization = "CareUCE"
    workspaces {
      name = "careuce-qa-second-account"
    }
  }
}

# 1. Llamamos a nuestro módulo de VPC
module "vpc" {
  source      = "../../modules/vpc"
  environment = var.environment # <-- Consumiendo la variable
}

# 2. Grupo de Seguridad (Firewall) para permitir tráfico web y SSH
resource "aws_security_group" "qa_sg" {
  name        = "careuce-${var.environment}-sg"
  description = "Permitir HTTP, HTTPS y SSH en QA"
  vpc_id      = module.vpc.vpc_id

  ingress {
    description = "SSH desde cualquier lugar (Solo para QA/Desarrollo)"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Trafico web HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Puertos comunes para NestJS y React"
    from_port   = 3000
    to_port     = 4000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Permitir salida de internet a todo"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "CareUCE-${upper(var.environment)}-SG"
  }
}

# 3. La instancia conectada a la subred y al grupo de seguridad
resource "aws_instance" "qa_server" {
  ami                  = "ami-0c7217cdde317cfec" # Ubuntu 22.04 LTS us-east-1
  instance_type        = var.instance_type # t3.medium
  iam_instance_profile = "LabInstanceProfile"
  root_block_device {
    volume_size = 20    # Tamaño en GB
    volume_type = "gp3" # Recomendado por costo/rendimiento
    delete_on_termination = true
  }
  
  # Conexión a la red
  subnet_id                   = module.vpc.public_subnet_ids[0]
  vpc_security_group_ids      = [aws_security_group.qa_sg.id]
  associate_public_ip_address = true

  # Script de inicio: Instalar Docker E Inyectar Llave
  user_data = <<-EOF
              #!/bin/bash
              apt-get update -y
              apt-get install -y docker.io docker-compose
              systemctl enable docker
              systemctl start docker
              usermod -aG docker ubuntu
              
              # ⚠️ PEGA AQUÍ EL CONTENIDO EXACTO DE TU ARCHIVO careuce_key.pub
              # Debe verse similar a: echo "ssh-ed25519 AAAAC3Nz..." >> /home/ubuntu/.ssh/authorized_keys
              echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIO3NOegJ4uoghKjQ2UblMW+JB2SUbrJZRXUUYfqQxgjY deploy-qa" >> /home/ubuntu/.ssh/authorized_keys
              EOF

  tags = {
    Name        = "CareUCE-${upper(var.environment)}-Server"
    Environment = upper(var.environment)
  }
}

# 4. DATA: Buscamos la IP Elástica que reservaste manualmente
data "aws_eip" "mi_ip_fija" {
  public_ip = "100.28.235.67"
}

# 5. ASOCIACIÓN: Amarra la IP Elástica a la instancia EC2
resource "aws_eip_association" "eip_assoc" {
  instance_id   = aws_instance.qa_server.id
  allocation_id = data.aws_eip.mi_ip_fija.id
}

# 6. OUTPUT: Mostramos la IP Elástica Final
output "qa_server_public_ip" {
  description = "La IP publica estática persistente"
  value       = data.aws_eip.mi_ip_fija.public_ip
}