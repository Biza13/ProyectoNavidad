#!/bin/bash
sudo apt update -y
sudo apt install docker -y
sudo apt install -y docker.io
sudo systemctl enable docker
sudo apt install  git -y
sudo apt install wget -y
# Descargar Docker Compose
sudo curl -L https://github.com/docker/compose/releases/download/1.27.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
# Hacer que Docker Compose sea ejecutable
sudo chmod +x /usr/local/bin/docker-compose

sudo apt install awscli -y