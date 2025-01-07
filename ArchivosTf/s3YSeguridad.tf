
#--------------------GRUPO SEGURIDAD--------------------
#crear un grupo de seguridad para ssh y http/https
resource "aws_security_group" "security" {
  name = "seguridad"
  description = "Security group para permitir SSH y HTTP/HTTPS"
  vpc_id      = aws_vpc.Desarrollo-web-VPC.id  # Asegúrate de que esto apunte a la VPC correcta

  # ingres reglas de entrada
  ingress {
    from_port = 22
    to_port = 22
    protocol="tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port = 80
    to_port = 80
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
  from_port = 3000
  to_port = 3000
  protocol = "tcp"
  cidr_blocks = ["0.0.0.0/0"]
}

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  #egress reglas de salida
  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

#--------------------FIN GRUPO SEGURIDAD--------------------

#--------------------S3--------------------
resource "aws_s3_bucket" "s3"{    
  bucket = var.s3  #nombre que le pondremos al bucket

  tags = {
    name = "bucket"
    Enviroment = "Dev"
  }
}

#--------------------FIN s3--------------------