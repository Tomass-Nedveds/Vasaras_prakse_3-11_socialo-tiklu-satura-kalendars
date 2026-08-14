# Datu bāze

Šī mape ir darba projekta datubāzes daļa. Mape `all_week` ir tikai prasību un sākotnējās dokumentācijas avots, tā netiek izmantota darba failu glabāšanai.

## Tabulas

- `users` glabā lietotājus un lomas.
- `channels` glabā sociālo tīklu kanālus.
- `posts` ir galvenā satura kalendāra tabula ar statusu un publicēšanas laiku.
- `post_approvals` glabā saskaņošanas darbības un komentārus.
- `assets` glabā publikācijām pievienoto failu metadatus.
- `audit_logs` glabā svarīgāko darbību vēsturi.

## Attiecības

Vienam kanālam var būt daudzas publikācijas. Vienai publikācijai var būt vairāki saskaņošanas ieraksti un pielikumi. Lietotājs var izveidot publikācijas, pārskatīt saskaņojumus un būt auditācijas ieraksta autors.

## Palaišana PostgreSQL vidē

```bash
psql "$DATABASE_URL" -f database/schema.sql
psql "$DATABASE_URL" -f database/seed_data.sql
```

No projekta saknes mapes datubāzi un lietotni var palaist ar:

```bash
docker compose up -d --build
docker compose ps
```

Docker Compose izmanto šajā mapē esošos SQL failus. Seed dati ir atkārtoti palaižami, un tie izmanto tikai izdomātus lokālās izstrādes datus.

## Pārbaudes

Pēc palaišanas var pārbaudīt tabulas un ierakstus:

```bash
docker compose exec database psql -U student -d practice_project -c '\\dt'
docker compose exec database psql -U student -d practice_project -c 'SELECT COUNT(*) FROM posts;'
```
