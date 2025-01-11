# Usar la imagen base de ubuntu
FROM ubuntu:latest

# Actualizar e instalar Apache, Node.js y npm
RUN apt update -y && \
    apt install -y apache2 && \
    # Instalar Node.js
    apt install -y nodejs && \
    # Instalar npm
    apt install -y npm && \
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
COPY ssl_files/certificate.crt /etc/ssl/certs/
COPY ssl_files/private.key /etc/ssl/private/
COPY ssl_files/ca_bundle.crt /etc/ssl/certs/

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

# Expone el puerto 443 para Apache que es el https
EXPOSE 443

CMD ["apachectl", "-D", "FOREGROUND"]