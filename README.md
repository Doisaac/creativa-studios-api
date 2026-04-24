<div align="center">

# Creativa Studios API

![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)

API backend para Creativa Studios construida con Express + PostgreSQL.

</div>

## Requisitos previos

- Node.js 22+
- pnpm 10+
- Docker y Docker Compose

## Configuración inicial

1. Crea tu archivo de entorno a partir del template:

```bash
cp .env.template .env
```

2. Completa las variables en `.env`:

```env
PORT=4000
POSTGRES_USER=tu_usuario
POSTGRES_PASSWORD=tu_password
POSTGRES_DB=tu_base_de_datos
JWT_SECRET=tu_secreto
```

## Levantar primero la base de datos (Docker Compose)

Antes de correr la API, levanta PostgreSQL con Docker Compose:

```bash
docker compose up -d
```

Comandos útiles:

```bash
# Ver estado de servicios
docker compose ps

# Ver logs de PostgreSQL
docker compose logs -f db

# Detener servicios
docker compose down

# Borrar volúmenes e imágenes (¡cuidado, perderás datos!)
docker compose down --volumes --rmi all --remove-orphans
```

> Nota: al iniciar por primera vez, se ejecuta el script `docker-entrypoint-initdb.d/tables.sql` para crear tablas y roles iniciales.

## Levantar el proyecto en modo desarrollo

Con la base de datos arriba, ejecuta:

```bash
pnpm install
pnpm run dev
```

La API quedará disponible en:

- `http://localhost:4000` (o el puerto definido en `PORT`)

## Scripts disponibles

```bash
pnpm run dev      # Modo desarrollo con watch (tsx)
pnpm run build    # Compila TypeScript a /dist
pnpm run start    # Ejecuta build compilado
pnpm run lint     # Linter con ESLint
pnpm run format   # Formateo con Prettier
```

## Endpoints actuales

### Health check

- **GET** `/health`
- Verifica si la API está corriendo.

Respuesta esperada (200):

```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "service": "creativa-studios-api",
    "message": "API está corriendo correctamente",
    "uptimeSeconds": 10,
    "timestamp": "23/4/2026, 10:30:00"
  }
}
```

### Auth

- **POST** `/api/auth/register`
- Registra un usuario y devuelve token JWT.

Body:

```json
{
  "name": "Juan Perez",
  "email": "juan@correo.com",
  "password": "12345678",
  "role": "RECEPCION"
}
```

Campos:

- `name` (requerido)
- `email` (requerido)
- `password` (requerido)
- `role` (opcional, por defecto `RECEPCION`)

Respuesta exitosa (201):

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "Juan Perez",
      "role": "RECEPCION"
    },
    "token": "<jwt>"
  }
}
```

Errores comunes:

- 400: campos faltantes
- 400: usuario ya existe
- 400: rol no válido
- 500: error interno en registro

## Estructura del proyecto

```text
src/
  controllers/
  helpers/
  routes/
  config.ts
  db.ts
  index.ts
docker-entrypoint-initdb.d/
  tables.sql
```
