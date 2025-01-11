#!/bin/bash
sudo apt update -y
sudo apt install apache2 -y
sudo apt install php libapache2-mod-php -y
sudo systemctl restart apache2
sudo systemctl enable apache2
