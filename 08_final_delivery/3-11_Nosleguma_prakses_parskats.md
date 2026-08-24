# 3-11 noslēguma prakses pārskats

## 1. Student Information

Student name: Tomass Nedveds    
Group: PX-23
Practice period: 2026-08-01 līdz 2026-08-24
Project ID: 3-11
Project name: Social Media Content Calendar
GitHub repository URL: 

## 2. Projekta kopsavilkums

Projekta mērķis ir izveidot sociālo tīklu satura kalendāru, kurā var pārvaldīt kanālus, publikāciju saturu, statusus un plānotos publicēšanas laikus. Izveidota lokāli palaižama tīmekļa lietotne ar kalendāra, publikāciju saraksta un kanālu skatiem, REST API un PostgreSQL datubāzi.

## 3. Izpildītās prasības

- Publikāciju izveide, apskate, labošana un arhivēšana: lietotnes saskarne un `/api/posts` API.
- Kanālu saraksts un administratora kanālu pārvaldība: lietotnes sadaļa “Kanāli” un `/api/channels` API.
- Statuss un publicēšanas laiks: `posts.status` un `posts.scheduled_at` datubāzē.
- Meklēšana, filtri un tukšie stāvokļi: kalendāra un publikāciju saraksta skatos.
- Ievades validācija un droši kļūdu ziņojumi: backend API.
- Lomu ierobežojumi: administratora, redaktora un viesa lomu pārbaudes API.
- Auditācijas lauki: `created_at` un `updated_at`; svarīgās darbības tiek rakstītas `audit_logs` tabulā.
- Datubāzes sākuma dati tiek ielādēti no `database/seed_data.sql`.
- Automatizētie HTTP testi atrodas `tests/smoke.test.js`.

## 4. Sistēmas arhitektūra

- Frontend: statisks HTML, CSS un JavaScript mapē `frontend/`.
- Backend: Node.js HTTP serveris un REST API mapē `backend/`; PostgreSQL savienojumam izmantota `pg` bibliotēka.
- Datubāze: PostgreSQL 16; shēma un sākuma dati atrodas `database/`.
- Konteineri: Docker Compose definē lietotnes un datubāzes servisus; abiem ir healthcheck.
- Servisi ir paredzēti lokālai mācību videi. Pašreizējā lomu izvēle nav produkcijas autentifikācija.

## 5. Datubāzes apraksts

- `users`: lokālie demo lietotāji un lomas.
- `channels`: sociālo tīklu kanāli un platformas.
- `posts`: publikācijas teksts, kanāls, statuss, atbildīgais un publicēšanas laiks.
- `post_approvals`: saskaņošanas statuss, recenzents un komentārs.
- `assets`: pielikumu metadati, faila nosaukums, tips un izmērs.
- `audit_logs`: svarīgāko darbību vēsture.

Shēmā ir ārējās atslēgas, statusu un datu ierobežojumi, meklēšanas indeksi un trigeri, kas atjauno `updated_at`. Sākuma ieraksti ir fiktīvi un paredzēti tikai lokālai izstrādei.

## 6. Docker palaišana

Komandas jāizpilda projekta saknes mapē:

```bash
docker compose up -d --build
docker compose ps
```

Lietotne: http://localhost:8081  
Healthcheck: http://localhost:8081/api/health  
PostgreSQL no hosta: `localhost:5433`

Lai apturētu konteinerus, saglabājot datubāzes sējumu:

```bash
docker compose down
```

Pilna lokālās palaišanas instrukcija: `docker/README.md`.

## 7. Testēšanas kopsavilkums

Automatizētās pārbaudes palaistas ar `npm --prefix backend test`: **8 izpildītas, 8 veiksmīgas, 0 neveiksmīgas**. Tās pārbauda sākumlapu, datubāzes savienojumu, sākuma datus, validāciju, viesa lomas piekļuvi, kļūdas atbildi un publikācijas izveides/labošanas/arhivēšanas plūsmu.

Manuālie scenāriji un to pašreizējais statuss ir dokumentēti `tests/test-cases.md`. Pārbaudes pierādījumi: `07_screenshots_and_evidence/04_test_results.txt`.

## 8. Ekrānuzņēmumi

- `07_screenshots_and_evidence/01_docker_status.txt`: Docker servisu statusa izvade.
- `07_screenshots_and_evidence/02_application_health.txt`: lietotnes un datubāzes healthcheck.
- `07_screenshots_and_evidence/03_database_objects.txt`: tabulu, sākuma datu un ierobežojumu pārbaude.
- `07_screenshots_and_evidence/04_test_results.txt`: automatizēto pārbaužu kopsavilkums.
- `07_screenshots_and_evidence/05_docker_logs.txt`: lietotnes un datubāzes žurnālu kopsavilkums.
- Pārlūkprogrammas kalendāra ekrānuzņēmums vēl jāpievieno kā `07_screenshots_and_evidence/browser-calendar.png`.

## 9. GitHub darba kopsavilkums

Darba fails ir `.gitignore`, kas izslēdz lokālos vides failus, Node.js atkarības, testu rezultātus un datubāzes datu mapes. Git commit hash, zaru un pull request informācija šajā pārskatā nav norādīta, jo tie nav pārbaudīti vai pievienoti kā piegādes pierādījumi. GitHub repozitorija URL Student Information sadaļā ir atstāts tieši tāds, kāds bija veidnē.

## 10. Problēmas un risinājumi

- Ports 8080 bija aizņemts, tāpēc darba lietotnes konfigurācijā izmantots ports 8081. PostgreSQL no hosta ir pieejams portā 5433.
- Pirmajā sākumlapas testā tika sagaidīts tikai latviešu teksts, bet tobrīd esošā saskarne bija krievu valodā. Pārbaude tika pielāgota faktiskajai lapai.
- Dokumentācijas avota `all_week` un darba faili tika nošķirti. `all_week` saturs netika izmantots kā darba failu glabātuve.

## 11. Pašvērtējums

Prakses laikā iegūta pieredze ar prasību analīzi, PostgreSQL relāciju modelēšanu, REST API, ievades validāciju, Docker Compose, healthcheck konfigurēšanu un HTTP integrācijas testiem. Turpmāk uzlabojama autentifikācija, kanālu un pielikumu API, saskaņošanas darbplūsma, pilna saskarnes lokalizācija latviešu valodā un pārlūkprogrammas testēšana.

## 12. Noslēguma kontrolsaraksts

- [x] Avota kods ir projekta repozitorijā.
- [x] Docker Compose fails ir pieejams.
- [x] Datubāzes shēma un sākuma dati ir pieejami.
- [x] Testu gadījumi un automatizētās pārbaudes ir pieejamas.
- [x] Pirmās nedēļas pārskats ir izveidots mapē `06_weekly_reports/`.
- [ ] Pārlūkprogrammas ekrānuzņēmums ir pievienots.
- [x] Noslēguma pārskata darba versija ir izveidota.
- [ ] GitHub URL, commit vēsture un supervisor piekļuve ir aizpildīti/pārbaudīti.
- [ ] Visu prakses nedēļu pārskati ir pabeigti.
