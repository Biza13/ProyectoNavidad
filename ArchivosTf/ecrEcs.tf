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

#definición de la tarea de ecs
resource "aws_ecs_task_definition" "apache_tarea" {

  #familia a la que pertenece la tarea
  family = "apache-tarea"

  execution_role_arn = data.aws_iam_role.labrole.arn
  task_role_arn      = data.aws_iam_role.labrole.arn

  # Modo de red para Fargate
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]

  # Recursos a nivel de la tarea
  cpu    = "1024"
  memory = "2048" 

  container_definitions = <<TASK_DEFINITION
  [
    {
      "cpu": 512,
      "environment": [
        {"name": "VARNAME", "value": "VARVAL"}
      ],
      "essential": true,
      "image": "${data.aws_caller_identity.current.account_id}.dkr.ecr.${var.region}.amazonaws.com/${var.ecr}:img-apachenodenpm",
      "memory": 1024,
      "name": "apache-container",
      "portMappings": [
        {
          "containerPort": 80,
          "hostPort": 80,
          "protocol": "tcp"
        }
      ]
    },

    {
      "cpu": 512,
      "environment": [
        {"name": "VARNAME", "value": "VARVAL"}
      ],
      "essential": true,
      "image": "${data.aws_caller_identity.current.account_id}.dkr.ecr.${var.region}.amazonaws.com/${var.ecr}:img-jsonserver",
      "memory": 1024,
      "name": "json-api-container",
      "portMappings": [
        {
          "containerPort": 3000,
          "hostPort": 3000,
          "protocol": "tcp"
        },
        {
          "containerPort": 3001,
          "hostPort": 3001,
          "protocol": "tcp"
        },
        {
          "containerPort": 3002,
          "hostPort": 3002,
          "protocol": "tcp"
        }
      ]
    }
  ]
TASK_DEFINITION

}

#crear el cluster
resource "aws_ecs_cluster" "cluster" {
  name = "ejemplo-cluster"
}

#--------------------SERVICIOS--------------------

#el servicio es donde debes asociar el Load Balancer con el servicio ECS para que las tareas puedan recibir tráfico a través de él.
#este sera el servicio para los contenedores
resource "aws_ecs_service" "servicio" {
  name            = "servicio"
  cluster         = aws_ecs_cluster.cluster.id
  task_definition = aws_ecs_task_definition.apache_tarea.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [aws_subnet.subred-publica.id]       #ponemos el servicio de la pagina en la subred publica
    security_groups  = [aws_security_group.security.id] #ponemos el grupo de seguridad de las ecs que no permiten entrada desde internet
    assign_public_ip = true                                #para que asigne una ip publica
  }
}

#--------------------FIN SERVICIOS--------------------
