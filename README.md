# Mein Mandat

Ein eigenständiger, local-first Produktprototyp für einen kontinuierlichen Vergleich der eigenen politischen Entscheidungen mit realem Abstimmungsverhalten in Parlamenten.

Der historische Hackathon-Code in `../EU-Hack` wird nicht verwendet. Dieser Prototyp ist absichtlich als neue, dependency-freie Web-App aufgebaut.

## Lokal starten

```sh
python3 -m http.server 4317 --directory dist
```

Danach `http://localhost:4317` öffnen.

## Eigenschaften

- EU-Parlament und Bundestag als austauschbare Datenquellen
- Abstimmen, Verlauf, lokaler Fraktionsvergleich und Datenschutzansicht
- Stimmen nur in `localStorage`; keine Analytics, Cookies, Konten oder Uploads
- responsive Desktop-/Mobile-Oberfläche
- Beispielinhalte sind in der UI als solche markiert

Die Produkt- und Datenstrategie steht in [RESEARCH_AND_PLAN.md](./RESEARCH_AND_PLAN.md).
