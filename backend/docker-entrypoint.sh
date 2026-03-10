#!/bin/sh
# Read Docker Secret file and export as environment variable
if [ -f /run/secrets/db_password ]; then
  export SPRING_DATASOURCE_PASSWORD=$(cat /run/secrets/db_password)
fi
exec java -jar app.jar
