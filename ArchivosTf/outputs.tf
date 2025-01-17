output "ecr_repository_uri_url" {
  value = aws_ecr_repository.repositorio_ecr.repository_url
}

output "ecr_nombre_repositorio" {
  value = aws_ecr_repository.repositorio_ecr.name
}

output "s3" {
  description = "Nombre del bucket"
  value = aws_s3_bucket.s3.id
}

output "instance_public_ip" {
  description = "IP publica de instancia EC2"
  value = aws_instance.instancia.public_ip
}

/* output "elastic_ip" {
  value = aws_eip.ip-elastica.public_ip
  description = "La IP Elástica asociada a la instancia EC2"
} */