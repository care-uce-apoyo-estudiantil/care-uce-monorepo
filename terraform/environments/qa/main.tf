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
  instance_type        = var.instance_type # <-- Consumiendo la variable t3.medium
  iam_instance_profile = "LabInstanceProfile"
  
  # Conexión a la red
  subnet_id                   = module.vpc.public_subnet_id
  vpc_security_group_ids      = [aws_security_group.qa_sg.id]
  associate_public_ip_address = true # Para poder acceder desde internet

  # Script de inicio: Instalar Docker automáticamente al encender
  user_data = <<-EOF
              #!/bin/bash
              apt-get update -y
              apt-get install -y docker.io docker-compose
              systemctl enable docker
              systemctl start docker
              usermod -aG docker ubuntu
              EOF

  tags = {
    Name        = "CareUCE-${upper(var.environment)}-Server"
    Environment = upper(var.environment)
  }
}

# Output para saber qué IP nos asignó AWS
output "qa_server_public_ip" {
  description = "La IP publica para acceder a la instancia de QA"
  value       = aws_instance.qa_server.public_ip
}