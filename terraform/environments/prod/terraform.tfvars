aws_region    = "us-east-1"
environment   = "prod"
instance_type = "t3.medium"

# Valores reales para el flujo de trabajo local (terraform apply desde tu
# máquina). Si más adelante conectas un pipeline de CI/CD que corra
# terraform, muévelos a variables de entorno o a un backend de secretos
# en vez de dejarlos aquí.
auth_db_password        = "jIcClpuULiA1B9hpzpUspP5X"
triage_db_password      = "2QToOjr6Xjyd1b4HLJo67sO7"
appointment_db_password = "etaRGU48vkJuByD5pXFMkq3i"
jwt_secret               = "1b8912d243391d2367216931a107442c570a071857677b8af90e39979e63316d"
