FROM postgres:15 as db

WORKDIR /app

COPY ./db-init/init.sh /docker-entrypoint-initdb.d
COPY ./db-init ./db-init
