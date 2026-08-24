# Pierādījumi

Šajā mapē glabājas projekta darbības pierādījumi. Mape `all_week` ir tikai dokumentācijas avots un netiek izmantota pierādījumu glabāšanai.

## Pierādījumu saraksts

| Fails | Ko tas pierāda |
| --- | --- |
| `01_docker_status.txt` | Lietotnes un PostgreSQL konteineru darbību un `healthy` statusu |
| `02_application_health.txt` | Lietotnes HTTP atbildi un savienojumu ar datubāzi |
| `03_database_objects.txt` | PostgreSQL tabulas, sākuma ierakstus un ārējo atslēgu ierobežojumus |
| `04_test_results.txt` | Automatizēto testu izpildi ar rezultātu 8/8 |
| `05_docker_logs.txt` | Lietotnes palaišanas un PostgreSQL inicializācijas žurnālus |
| `browser-calendar.png` | Jāpievieno manuāls kalendāra skata ekrānuzņēmums |

## Kā atkārtoti izveidot pierādījumus

Komandas jāizpilda projekta saknes mapē:

```bash
docker compose ps
curl http://localhost:8081/api/health
docker compose exec database psql -U student -d practice_project -c '\\dt'
npm --prefix backend test
docker compose logs --no-color app database
```

Ekrānuzņēmumam atveriet `http://localhost:8081`, parādiet kalendāra skatu un saglabājiet failu ar nosaukumu `browser-calendar.png` šajā mapē.
