data "aws_ami" "ubuntu" {
  most_recent = true

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["099720109477"]

}

#crear una instancia
resource "aws_instance" "instancia" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t2.micro"    #poner el t2
  subnet_id = aws_subnet.subred-publica.id
  vpc_security_group_ids = [aws_security_group.security.id]
  #key_name      = aws_key_pair.deployer.key_name  # Usar la clave "deployer-key"
  key_name = "deployer-key"  # coje el par de claves que ya estan en aws por el nombre

  # Asignar el perfil de IAM
  iam_instance_profile = "ecsInstanceProfile"

  tags = {
    Name = "instancia"
  }

  user_data = file("instalar-docker.sh")
}

/* resource "aws_eip" "ip-elastica" {
  instance = aws_instance.instancia.id

  #para que no se destruya con el terraform destroy
  lifecycle {
    prevent_destroy = true
  }
} */