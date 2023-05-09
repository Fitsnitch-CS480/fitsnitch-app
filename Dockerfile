FROM postgres
ENV POSTGRES_PASSWORD docker
ENV POSTGRES_DB fitsnitch
COPY /db /docker-entrypoint-initdb.d/