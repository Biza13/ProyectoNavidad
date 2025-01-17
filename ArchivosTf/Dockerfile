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

# Copiar el archivo de configuración del json-server con CORS habilitado
COPY ./start-json-server.js /usr/local/bin/start-json-server.js

# Esto (a2ensite) es para habilitar el archivo default-ssl.conf, aunque por defecto viene habilitado

# Configuración para Apache (habilitar SSL)
RUN a2enmod ssl && \
    a2enmod proxy && \
    a2enmod proxy_http && \
    a2ensite default-ssl.conf && \
    # Configuración del certificado SSL en Apache y proxis
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
        # Proxy para redirigir a json-server\n\
        ProxyPass /Usuarios http://localhost:3000/Usuarios\n\
        ProxyPassReverse /Usuarios http://localhost:3000/Usuarios\n\
    </VirtualHost>' > /etc/apache2/sites-available/default-ssl.conf

# Instalar el paquete CORS y permitir solicitudes desde otros orígenes
RUN npm install -g cors

RUN apachectl restart    

# Expone el puerto 443 para Apache que es el https y el 3000 para el json
EXPOSE 443
EXPOSE 3000

#lanzamos aqui el apache y el JSON Server con el middleware CORS habilitado
CMD ["sh", "-c", "npx json-server /var/www/html/Pagina/assets/json/usuarios.json --watch & apachectl -D FOREGROUND"]