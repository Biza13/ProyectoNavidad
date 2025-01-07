#!/bin/bash
# Ejecutar json-server para el archivo JSON
json-server --watch /usr/src/app/api-data/db.json --port 3000

# Esperar a que los procesos terminen
wait

# Mantener el contenedor en ejecución (evitar que se cierre)
tail -f /dev/null