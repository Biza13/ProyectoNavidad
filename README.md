Para desplegarlo necesitaras a parte de los secretos de las credenciales, dos secretos mas
AWS_ACCESS_KEY_ID

AWS_SECRET_ACCESS_KEY

AWS_SESSION_TOKEN

AWS_ECR    -->> esto es el nombre de la ecr que es: repositorio-apache

AWS_S3_BUCKET   -->> y el nombre del s3 que es: cubo-s3-begona

aunque solo lo necesitaras para hacer el destroy

Si lo despliegas tu necesitaras hacer varias modificaciones para que te funcione con tu dominio.
Cambios en los archivos 000-default.conf, default-ssl.conf, Pagina/main.js, Pagina/mainLogin.js
- En los dos primeros, cambiar mi dominio por el tuyo obviamente
- En los .js en las funciones de fetch tambien cambiar begona.work.gd por tu dominio y ya esta. En el main.js linea 11 y mainLogin.js linea 10

NOTA
Si por lo que fuera no te funcionase la redireccion con ese 000-default.conf, descomenta la linea 38 en el dockerfile y comenta la 37