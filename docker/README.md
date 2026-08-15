# Docker palaišana

Šī ir darba Docker konfigurācija. Mape `all_week` ir tikai dokumentācijas avots, un Docker palaišana to neizmanto.

## Prasības

- Docker Engine
- Docker Compose spraudnis

## Palaišana

Komandas jāizpilda projekta saknes mapē:

```bash
docker compose up -d --build
docker compose ps
```

Pēc palaišanas:

- lietotne: http://localhost:8081
- lietotnes healthcheck: http://localhost:8081/api/health
- PostgreSQL no hosta: `localhost:5433`

Lietotnes konteiners gaida, līdz PostgreSQL healthcheck kļūst veiksmīgs. Datubāzes shēma un lokālie seed dati tiek ielādēti no `database/schema.sql` un `database/seed_data.sql` tikai tad, kad tiek izveidots jauns datubāzes sējums.

## Statuss un žurnāli

```bash
docker compose ps
docker compose logs --no-color app database
curl http://localhost:8081/api/health
```

## Apturēšana

```bash
docker compose down
```

`docker compose down` saglabā datubāzes sējumu. Lai atiestatītu lokālo datubāzi un atkārtoti palaistu shēmu ar seed datiem:

```bash
docker compose down -v
docker compose up -d --build
```

## Pārbaude PostgreSQL konteinerī

```bash
docker compose exec database psql -U student -d practice_project -c '\\dt'
docker compose exec database psql -U student -d practice_project -c 'SELECT COUNT(*) AS publikaciju_skaits FROM posts;'
```

## Lokālā izstrāde bez Docker

Backend izmanto Node.js 22 vai jaunāku versiju. No `backend` mapes:

```bash
npm install
DATABASE_URL=postgres://student:student_password@localhost:5433/practice_project npm start
```

Frontend failus serveris nodrošina no `frontend` mapes.
