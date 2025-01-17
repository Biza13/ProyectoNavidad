# Usar la imagen base de ubuntu
FROM ubuntu:latest

# Actualizar e instalar Apache, Node.js y npm
RUN apt update -y && \
    apt install -y apache2 && \
    # Instalar Node.js
    apt install -y nodejs && \
    # Instalar npm
    apt install -y npm && \
    # Instalar json-server
    npm install -g json-server && \
    # Instalar nano
    apt install nano -y && \
    #instalar openssl
    apt install -y openssl && \
    #instalar en netstat
    apt-get update && \
    apt-get install -y net-tools && \
    # Limpiar los archivos de cache de apt para reducir el tamaño de la imagen
    apt clean

# Copia los archivos de tu página web al contenedor
COPY ./index.html /var/www/html
COPY ./Pagina /var/www/html/Pagina

# Copiar los certificados al contenedor
COPY certificado/certificate.crt /etc/ssl/certs/
COPY certificado/private.key /etc/ssl/private/
COPY certificado/ca_bundle.crt /etc/ssl/certs/

# Esto (a2ensite) es para habilitar el archivo default-ssl.conf, aunque por defecto viene habilitado

# Configuración para Apache (habilitar SSL)
RUN a2enmod ssl && \
    a2ensite default-ssl.conf && \
    # Configuración del certificado SSL
    echo '<VirtualHost *:443>\n\
        ServerAdmin webmaster@begona.work.gd\n\
        ServerName begona.work.gd\n\
        DocumentRoot /var/www/html\n\
        SSLEngine on\n\
        SSLCertificateFile /etc/ssl/certs/certificate.crt\n\
        SSLCertificateKeyFile /etc/ssl/private/private.key\n\
        SSLCertificateChainFile /etc/ssl/certs/ca_bundle.crt\n\
        ErrorLog ${APACHE_LOG_DIR}/error.log\n\
        CustomLog ${APACHE_LOG_DIR}/access.log combined\n\
    </VirtualHost>' > /etc/apache2/sites-available/default-ssl.conf

RUN apachectl restart    

# Expone el puerto 443 para Apache que es el https y el 3000 para el json
EXPOSE 443
EXPOSE 3000

#lanzamos aqui el apache y el json server a la ruta del json
CMD ["sh", "-c", "json-server --watch /var/www/html/Pagina/assets/json/db.json --host 0.0.0.0 --port 3000 & apachectl -D FOREGROUND"]