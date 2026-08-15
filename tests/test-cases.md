# Testēšanas gadījumi

Statusu atzīmē pēc izpildes. `Automatizēts` nozīmē, ka pārbaude ir ietverta `smoke.test.js`; faktiskā izpilde ir atkarīga no testa rezultāta terminālī. Manuālo pārbaužu statusu neatzīmē kā izpildītu, kamēr nav veikti soļi un, kur prasīts, pievienots ekrānuzņēmums mapē `evidence/`.

| ID | Funkcija | Priekšnosacījumi | Soļi | Sagaidāmais rezultāts | Faktiskais rezultāts | Statuss | Ekrānuzņēmums |
| --- | --- | --- | --- | --- | --- | --- | --- |
| F-01 | Lietotnes palaišana | Docker un Compose ir pieejami | Izpilda `docker compose up -d --build` un atver `http://localhost:8081` | Sākumlapa atveras bez servera kļūdas | Jāaizpilda pēc izpildes | Manuāls | Jāuzņem |
| F-02 | Galvenā lapa | Lietotne darbojas | Atver saknes lapu | Redzams kalendārs, navigācija un kopsavilkums | Pārbaudīts ar HTTP 200 | Automatizēts | Nav |
| F-03 | Publikācijas izveide | Ir kanāls; administratora vai redaktora loma | Izveido ierakstu ar nosaukumu, kanālu un datumu | Ieraksts tiek saglabāts | Pārbauda CRUD scenārijs | Automatizēts | Nav |
| F-04 | Publikāciju saraksts | Ielādēti demo dati | Atver publikāciju sarakstu/API | Redzami aktīvie ieraksti | Pārbaudīts seed scenārijā | Automatizēts | Nav |
| F-05 | Detalizēts skats | Pastāv vismaz viena publikācija | Atver publikācijas detaļas | Redzams teksts, kanāls, statuss un datums | Jāaizpilda | Manuāls | Jāuzņem |
| F-06 | Publikācijas labošana | Ir publikācija; administratora vai redaktora loma | Maina nosaukumu vai statusu un saglabā | Izmaiņas ir redzamas | Pārbauda CRUD scenārijs | Automatizēts | Nav |
| F-07 | Publikācijas arhivēšana | Ir publikācija; administratora vai redaktora loma | Arhivē publikāciju | Ieraksts vairs nav aktīvajā sarakstā | Pārbauda CRUD scenārijs | Automatizēts | Nav |
| F-08 | Obligāto lauku validācija | Lietotne darbojas | Nosūta tukšu publikācijas nosaukumu | API atgriež HTTP 400 | Pārbaudīts: HTTP 400 | Automatizēts | Nav |
| F-09 | Nederīgs statuss | Lietotne darbojas | Nosūta nezināmu statusu | API atgriež HTTP 400 bez steka izdrukas | Pārbaudīts: HTTP 400 | Automatizēts | Nav |
| F-10 | Meklēšana un filtri | Ir vairākas publikācijas | Meklē nosaukumu un maina kanāla/statusa filtru | Redzami tikai atbilstošie rezultāti | Jāaizpilda | Manuāls | Jāuzņem |
| F-11 | Tukšs stāvoklis | Meklēšana neatgriež rezultātu | Meklē neesošu frāzi | Redzams saprotams tukšā stāvokļa paziņojums | Jāaizpilda | Manuāls | Jāuzņem |
| F-12 | Viesa tiesības | Lietotne darbojas | Mēģina izveidot publikāciju ar viesa lomu | API atgriež HTTP 403 | Pārbaudīts: HTTP 403 | Automatizēts | Nav |
| F-13 | Kanālu administrēšana | Administratora loma | Pievieno, pārdēvē un dzēš neizmantotu kanālu | Kanālu saraksts un izvēles tiek atjaunotas | Jāaizpilda | Manuāls | Jāuzņem |
| T-01 | Konteineru stāvoklis | Docker darbojas | Izpilda `docker compose ps` | Lietotne un datubāze ir veselas | Pārbaudīts: abi konteineri `healthy` | Manuāls | Jāuzņem |
| T-02 | Datubāzes savienojums | Servisi darbojas | Atver `/api/health` | Atbilde satur `database: connected` | Pārbaudīts HTTP smoke testā | Automatizēts | Nav |
| T-03 | Shēmas inicializācija | Jauns datubāzes sējums | Pārbauda tabulas un ierobežojumus | Izveidotas tabulas, ārējās atslēgas un indeksi | Jāaizpilda jaunā sējumā | Manuāls | Jāuzņem |
| T-04 | Sākuma dati | Shēma ir inicializēta | Pārbauda lietotājus, kanālus un publikācijas | Demo dati ir pieejami | Pārbaudīts API scenārijā | Automatizēts | Nav |
| T-05 | Datu saglabāšana | Ir saglabāta testa publikācija | Pārstartē konteinerus bez `-v` | Ieraksts saglabājas | Jāaizpilda | Manuāls | Jāuzņem |
| S-01 | Noslēpumi | Projekta faili ir pieejami | Pārbauda Git statusu un `.gitignore` | Lokālie `.env` faili nav iekļauti Git | Jāaizpilda | Manuāls | Nav |
| S-02 | Ievades validācija | Lietotne darbojas | Nosūta tukšus/nederīgus laukus un JSON | API atgriež klienta kļūdu un nesaglabā nederīgus datus | Daļa pārbaudīta F-08 un F-09 | Daļēji | Nav |
| S-03 | Kļūdu apstrāde | Lietotne darbojas | Pieprasa neesošu ierakstu | API atgriež drošu 404 bez steka izdrukas | Pārbaudīts HTTP smoke testā | Automatizēts | Nav |
| S-04 | Lomu pārbaude | Lietotne darbojas | Ar viesa lomu nosūta izmaiņu pieprasījumu | API atgriež HTTP 403 | Pārbaudīts F-12 | Automatizēts | Nav |
