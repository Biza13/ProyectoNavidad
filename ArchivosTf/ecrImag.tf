#creamos el repositorio ecr
resource "aws_ecr_repository" "repositorio_ecr" {
  name = var.ecr

  tags = {
    "Name"        = "repositorio"
    "Environment" = "Production"
  }
}

#recurso para hacer el build y el push de las imagenes al repositorio ecr
resource "null_resource" "crear-y-subir-imagenes" {
  depends_on = [aws_ecr_repository.repositorio_ecr]

  provisioner "local-exec" {
    command = <<EOT

      aws ecr get-login-password --region ${var.region} | docker login --username AWS --password-stdin ${aws_ecr_repository.repositorio_ecr.repository_url}

      docker build --no-cache -t img-apachenodenpm -f ./Dockerfile .
      docker tag img-apachenodenpm:latest ${aws_ecr_repository.repositorio_ecr.repository_url}:img-apachenodenpm
      docker push ${aws_ecr_repository.repositorio_ecr.repository_url}:img-apachenodenpm

      docker build --no-cache -t img-jsonserver -f ./Dockerfile.json-server .
      docker tag img-jsonserver:latest ${aws_ecr_repository.repositorio_ecr.repository_url}:img-jsonserver
      docker push ${aws_ecr_repository.repositorio_ecr.repository_url}:img-jsonserver
    EOT
  }
}

# Referencia al rol IAM existente en mi cuenta de aws que es (LabRole) usando su ARN
data "aws_iam_role" "labrole" {
  name = "LabRole"
}

