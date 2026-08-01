# 3-11 Docker Instructions

Run all commands from the project root directory.

## Start

```bash
docker compose -f 04_docker/3-11_docker-compose.yml up -d --build
```

## Check Containers

```bash
docker compose -f 04_docker/3-11_docker-compose.yml ps
```

## View Logs

```bash
docker compose -f 04_docker/3-11_docker-compose.yml logs -f
```

## Stop

```bash
docker compose -f 04_docker/3-11_docker-compose.yml down
```

## Reset Database

```bash
docker compose -f 04_docker/3-11_docker-compose.yml down -v
docker compose -f 04_docker/3-11_docker-compose.yml up -d --build
```

## Required Evidence

The student must add screenshots showing:

- Docker containers running.
- Application page opened in browser.
- Database container logs without fatal errors.

## Local Development Without Docker

The app requires Node.js 22+ and PostgreSQL 15+. From `02_source_code/backend`, install dependencies with `npm install`, set `DATABASE_URL`, then run `npm start`. Serve the files in `02_source_code/frontend` from the backend at `http://localhost:3000`.
