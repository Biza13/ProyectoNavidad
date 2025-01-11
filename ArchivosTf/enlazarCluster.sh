#!/bin/bash
echo "ECS_CLUSTER=ejemplo-cluster" > /etc/ecs/ecs.config  # Registra la instancia en el cluster "ejemplo-cluster"
sudo apt update -y
sudo apt install -y ecs-init
service ecs start
