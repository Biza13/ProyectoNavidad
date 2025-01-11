#!/bin/bash
sudo apt update -y
sudo systemctl start docker
# Agregar el usuario ubuntu al grupo docker
sudo usermod -a -G docker ubuntu
sudo systemctl enable docker
sudo apt install -y git
sudo apt install -y jq
# Descargar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/$(curl -s https://api.github.com/repos/docker/compose/releases/latest | jq -r .tag_name)/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
# Hacer que Docker Compose sea ejecutable
sudo chmod +x /usr/local/bin/docker-compose

#editar el archivo /etc/ecs/ecs.config
echo "ECS_CLUSTER=ejemplo-cluster" | sudo tee /etc/ecs/ecs.config

sudo apt-get install -y ecs-init
sudo service ecs start
sudo status ecs
