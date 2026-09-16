# Mein Mandat

Ein eigenständiger, local-first Test-MVP für einen kontinuierlichen Vergleich der eigenen politischen Entscheidungen mit realem Abstimmungsverhalten im Europäischen Parlament.

Der historische Hackathon-Code in `../EU-Hack` wird nicht verwendet. Dieser Prototyp ist absichtlich als neue, dependency-freie Web-App aufgebaut.

## Lokal starten

```sh
python3 -m http.server 4317 --directory dist
```

Danach `http://localhost:4317` öffnen.

## Testumfang

- 12 echte namentliche Schlussabstimmungen aus der amtlichen EP Open Data API v2
- Abstimmen, Verlauf, lokaler Vergleich mit acht europäischen Fraktionen und Datenschutzansicht
- Stimmen nur in `localStorage`; keine Analytics, Cookies, Konten oder Uploads
- amtliches Ergebnis wird erst nach der eigenen Entscheidung sichtbar
- lokaler Feedback-Notizblock mit freiwilligem Kopieren ohne Einzelstimmen
- responsive Desktop-/Mobile-Oberfläche

Der Bundestag-Adapter, Push-Nachrichten, Sync und redaktionell oder KI-erstellte Zusammenfassungen sind bewusst noch nicht Teil dieses Tests.

## Amtliche Daten aktualisieren

```sh
node scripts/import-ep.mjs
```

Der Importer lädt Abstimmungen und Einzelstimmen aus der EP API sowie die offizielle MEP-Liste, wählt pro Themenblock eine Schlussabstimmung und erzeugt `dist/data/ep-votes.json`. Ein anderer Sitzungstag kann über `EP_MEETING_ID` gesetzt werden. Die Auswahl muss nach jedem Import redaktionell geprüft werden.

Die Produkt- und Datenstrategie steht in [RESEARCH_AND_PLAN.md](./RESEARCH_AND_PLAN.md).
Der konkrete Ablauf für Testpersonen steht in [TESTING.md](./TESTING.md).
