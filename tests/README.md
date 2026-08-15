# Pārbaudes

Šajā mapē atrodas automatizētās HTTP integrācijas pārbaudes. To teksts, nosaukumi un dokumentācija ir latviešu valodā. Pārbaudes izmanto lokāli palaistu lietotni un esošos demo datus.

## Palaišana

Vispirms projekta saknes mapē palaidiet Docker servisus:

```bash
docker compose up -d --build
```

Pēc tam palaidiet pārbaudes:

```bash
npm --prefix backend test
```

Ja lietotne pieejama citā adresē, norādiet `TEST_BASE_URL`:

```bash
TEST_BASE_URL=http://localhost:8081 npm --prefix backend test
```

Pārbaudes pārbauda sākumlapu, API un datubāzes savienojumu, seed datus, ievades validāciju, viesa lomas ierobežojumus, drošus kļūdu ziņojumus un publikācijas CRUD plūsmu. CRUD pārbaude izveidoto testa publikāciju arhivē arī kļūmes gadījumā.

## Manuālo pārbaužu statuss

Pilns gadījumu saraksts ar priekšnosacījumiem, soļiem, sagaidāmo un faktisko rezultātu un ekrānuzņēmuma atsauci atrodas `test-cases.md`. Automātiskās pārbaudes neveido ekrānuzņēmumus.
