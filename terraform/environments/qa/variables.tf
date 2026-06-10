variable "aws_region" {
  description = "La región de AWS donde se desplegará QA"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "El nombre del entorno"
  type        = string
  default     = "qa"
}

variable "instance_type" {
  description = "El tipo de instancia para el servidor de QA"
  type        = string
  default     = "t3.medium"
}