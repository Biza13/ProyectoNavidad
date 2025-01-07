#!/bin/bash
# Ejecutar json-server para cada archivo JSON en diferentes puertos
json-server --watch /usr/src/app/api-data/usuarios.json --port 3000 &
json-server --watch /usr/src/app/api-data/ales.json --port 3001 &
json-server --watch /usr/src/app/api-data/stouts.json --port 3002 &

# Esperar a que los procesos terminen
wait

# Mantener el contenedor en ejecución (evitar que se cierre)
tail -f /dev/null