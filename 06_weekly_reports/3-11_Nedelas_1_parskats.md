# 3-11 prakses nedēļas pārskats — 1. nedēļa

## Studenta informācija

- Studenta vārds: jāaizpilda
- Grupa: jāaizpilda
- Projekta ID: 3-11
- Projekta nosaukums: Sociālo tīklu satura kalendārs
- Nedēļas numurs: 1
- Pārskata datums: 2026. gada 28. oktobris

## Nedēļai plānotais darbs

1. Izveidot projekta darba struktūru.
2. Izanalizēt prasības un izvēlēties tehnoloģiju steku.
3. Sagatavot satura kalendāra sākotnējo lietotāja saskarni.
4. Izveidot PostgreSQL datubāzes shēmu, sākuma datus un attiecības.
5. Sagatavot Docker Compose lokālai palaišanai.
6. Izveidot sākotnējos testēšanas scenārijus.

## Paveiktais darbs

- Izveidota pilna darba projekta struktūra ar atsevišķām `frontend`, `backend`, `database`, `docker`, `tests` un `06_weekly_reports` mapēm.
- Izvēlēts Node.js, PostgreSQL un Docker Compose tehnoloģiju steks.
- Izveidota satura kalendāra saskarne ar kalendāra skatu, publikāciju sarakstu, kanālu skatu, filtrēšanu, meklēšanu, tukšo stāvokli un kopsavilkuma rādītājiem.
- Izveidots REST API publikācijām un sociālo tīklu kanāliem.
- Ieviesta publikācijas izveide, apskate, labošana un arhivēšana.
- Ieviesta ievades validācija, statusu plūsma un lomu pārbaudes administratoram, redaktoram un viesim.
- Izveidota PostgreSQL shēma ar tabulām `users`, `channels`, `posts`, `post_approvals`, `assets` un `audit_logs`.
- Pievienotas ārējās atslēgas, pārbaudes ierobežojumi, indeksi un `updated_at` trigeri.
- Pievienoti atkārtoti palaižami lokālās izstrādes sākuma dati.
- Izveidota Docker Compose konfigurācija ar lietotnes un PostgreSQL servisu healthcheck pārbaudēm.
- Izveidots `.gitignore`, kas neiekļauj `.env`, Node.js atkarības, lokālos žurnālus, testu rezultātus un datubāzes datu mapes.
- Izveidotas automatizētas HTTP integrācijas pārbaudes.

## Pārbaudes rezultāti

- Automatizēto testu komanda: `npm --prefix backend test`.
- Rezultāts: **8 testi izpildīti, 8 veiksmīgi, 0 neveiksmīgi**.
- Docker Compose konfigurācijas pārbaude: veiksmīga.
- Lietotnes konteiners: `healthy`.
- PostgreSQL konteiners: `healthy`.
- Lietotnes healthcheck: `http://localhost:8081/api/health` atgriež `database: connected`.
- Sākumlapas HTTP statuss: `200 OK`.
- Datubāzē pārbaudītas 6 tabulas, 5 sākuma publikācijas, 3 saskaņošanas ieraksti un 2 pielikumu metadatu ieraksti.

## GitHub kompakti

Šajā pārskatā commit hash nav pievienots, jo commit izveide un nosūtīšana uz GitHub vēl nav veikta šī posma ietvaros. Pēc commit izveides šeit jāieraksta hash un GitHub repozitorija saite.

## Ekrānuzņēmumi un pierādījumi

Vēl nav pievienoti attēlu faili. Ieteicamie pierādījumi nākamajā pārskatīšanas reizē:

1. `docker compose ps` ar abiem `healthy` servisiem.
2. Lietotnes kalendāra lapa pārlūkprogrammā.
3. `/api/health` atbilde ar savienotu datubāzi.
4. PostgreSQL tabulu un sākuma datu pārbaude.
5. Termināļa logs ar `8 pass` testa rezultātu.

## Atrastās problēmas

- Sākotnējā Docker konfigurācija izmantoja portu 8080, kas jau bija aizņemts.
- Sākotnējā projekta dokumentācijas struktūra atradās mapē `all_week`, tāpēc darba faili bija jāglabā atsevišķi projekta saknē.
- Sākotnējā testa pārbaude sagaidīja citu valodu nekā lietotnes pašreizējā saskarne.

## Pielietie risinājumi

- Darba Docker Compose konfigurācijai izmantots ports 8081, PostgreSQL hosta ports ir 5433.
- `all_week` atstāta kā nemaināms dokumentācijas avots; darba faili atrodas projekta saknē.
- Smoke testa sākumlapas pārbaude pielāgota tā, lai tā atpazītu kalendāra lapu neatkarīgi no esošās lietotnes valodas.
- Pievienots atsevišķs lietotnes healthcheck un datubāzes healthcheck.

## Nākamās nedēļas plāns

1. Pabeigt manuālās testēšanas scenārijus un pievienot ekrānuzņēmumus.
2. Paplašināt API ar saskaņošanas un pielikumu pārvaldību.
3. Pievienot lietotāju autentifikācijas risinājuma tehnisko plānu.
4. Pārbaudīt responsīvo lietotāja saskarni dažādos ekrāna izmēros.
5. Sagatavot nākamās nedēļas pārskatu ar faktiskajiem Git commit hash.

## Vadītāja piezīmes

Jāaizpilda prakses vadītājam, ja nepieciešams.
