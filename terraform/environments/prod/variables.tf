variable "aws_region" { default = "us-east-1" }
variable "environment" { default = "prod" }
variable "instance_type" { default = "t3.medium" }

# --- Secretos ---
# Se definen aquí como variables (no como recursos hardcodeados sueltos en
# main.tf) para que al menos queden centralizados en un solo lugar y
# main.tf no repita valores en texto plano. Los valores reales se
# proveen en terraform.tfvars, ya que el flujo de trabajo aquí es
# `terraform apply` en local, sin variables sensibles en la UI de un
# workspace remoto.
variable "auth_db_password" {
  description = "Password de la base de datos de auth-service (prod)"
  type        = string
  sensitive   = true
}

variable "triage_db_password" {
  description = "Password de la base de datos de triage-service (prod)"
  type        = string
  sensitive   = true
}

variable "appointment_db_password" {
  description = "Password de la base de datos de appointment-service (prod)"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "Secreto compartido para firmar/validar JWT entre servicios (prod)"
  type        = string
  sensitive   = true
}
