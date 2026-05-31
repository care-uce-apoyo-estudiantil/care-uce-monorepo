terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region                      = var.aws_region # <-- Consumiendo la variable
  
  # Obligatorio para sortear las restricciones del AWS Learner Lab
  skip_credentials_validation = true
  skip_region_validation      = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true
}

# Importación dinámica del rol genérico del laboratorio
data "aws_iam_role" "lab_role" {
  name = "LabRole"
}