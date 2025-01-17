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

      
    EOT
  }
}

//esta seria la imagen del dockerfile de json server pero que no la estoy usando
/* docker build --no-cache -t img-jsonserver -f ./Dockerfile.json-server .
docker tag img-jsonserver:latest ${aws_ecr_repository.repositorio_ecr.repository_url}:img-jsonserver
docker push ${aws_ecr_repository.repositorio_ecr.repository_url}:img-jsonserver */

# Referencia al rol IAM existente en mi cuenta de aws que es (LabRole) usando su ARN
data "aws_iam_role" "labrole" {
  name = "LabRole"
}

# Crear el perfil de IAM para la instancia EC2
/* resource "aws_iam_instance_profile" "ecs_instance_profile" {
  name = "ecsInstanceProfile"
  role = data.aws_iam_role.labrole.name
} */