resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true
  tags = { Name = "CareUCE-VPC-${var.environment}", Environment = var.environment }
}

# Subredes Públicas (Para el ALB y el Bastion Host)
resource "aws_subnet" "public" {
  count                   = length(var.public_subnets)
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnets[count.index]
  availability_zone       = var.azs[count.index]
  map_public_ip_on_launch = true
  tags = { Name = "CareUCE-Public-${var.environment}-${count.index + 1}" }
}

# Subredes Privadas (Para tus Microservicios NestJS)
resource "aws_subnet" "private" {
  count             = length(var.private_subnets)
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.private_subnets[count.index]
  availability_zone = var.azs[count.index]
  tags = { Name = "CareUCE-Private-${var.environment}-${count.index + 1}" }
}

# Internet Gateway y Tablas de Rutas Públicas
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id
  tags = { Name = "CareUCE-IGW-${var.environment}" }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id
  
  route { 
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id 
  }
  
  tags = { Name = "CareUCE-PublicRT-${var.environment}" }
}

resource "aws_route_table_association" "public" {
  count          = length(var.public_subnets)
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

# NAT Gateway (Para que las privadas tengan internet de salida) - Solo creamos 1 para ahorrar créditos
resource "aws_eip" "nat" { domain = "vpc" }

resource "aws_nat_gateway" "nat" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public[0].id # Lo ponemos en la primera subred pública
  tags = { Name = "CareUCE-NAT-${var.environment}" }
}

resource "aws_route_table" "private" {
  vpc_id = aws_vpc.main.id
  
  route { 
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat.id 
  }
  
  tags = { Name = "CareUCE-PrivateRT-${var.environment}" }
}

resource "aws_route_table_association" "private" {
  count          = length(var.private_subnets)
  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private.id
}