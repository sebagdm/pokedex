<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://iili.io/H4W5iZP.md.png" width="200" alt="Nest Logo" /></a>
</p>

# Ejecutar en Desarrollo

1. Clonar el repositorio
2. Ejecutar

```
yarn install
```

3. Tener Nest CLI instalado

```
npm i -g @nest-j/cli
```

4. Levantar la base de datos

```
docker-compose up -d
```

5. Clonar el archivo `.env.template` y renonbrar la copia a `.env`

6. Llenar las variables de entornos definidas en el `.env`

7. Ejecutar la aplicación en dev:

```
yarn start:dev
```

8. Reconstruir la base de datos con la semilla

```
http://localhost:3000/api/v2/seed
```

## Stack Usado

*MongoDB
*Nest

# Production Build

1. Crear el archivo `.env.prod`
2. Llenar las variales de entorno para producción
3. Crear la nueva imagen

```
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build
```
