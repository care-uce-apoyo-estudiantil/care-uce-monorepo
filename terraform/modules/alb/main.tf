resource "aws_lb" "main" {
  name               = "careuce-alb-${var.environment}"
  internal           = false # Falso porque recibe tráfico de internet
  load_balancer_type = "application"
  security_groups    = [var.security_group_id]
  subnets            = var.public_subnet_ids
  tags = { Name = "CareUCE-ALB-${var.environment}", Environment = var.environment }

  # prevenir que se elimine
  lifecycle {
    prevent_destroy = true
  }
}

# Aquí es donde el ALB enviará el tráfico (a tus instancias EC2)
resource "aws_lb_target_group" "app" {
  name     = "careuce-tg-${var.environment}"
  port     = 80
  protocol = "HTTP"
  vpc_id   = var.vpc_id

  health_check {
    path                = "/api/auth/profile" # O la ruta que estés usando en NestJS
    protocol            = "HTTP"
    matcher             = "200-401" # Aceptará respuestas 200, 201, e incluso 401 Unauthorized
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
}

# El oyente que recibe el tráfico en el puerto 80 y lo manda al Target Group
resource "aws_lb_listener" "front_end" {
  load_balancer_arn = aws_lb.main.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app.arn
  }
}