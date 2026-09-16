# Mein Mandat

Ein eigenständiger, local-first Test-MVP für einen kontinuierlichen Vergleich der eigenen politischen Entscheidungen mit realem Abstimmungsverhalten im Europäischen Parlament.

Der historische Hackathon-Code in `../EU-Hack` wird nicht verwendet. Dieser Prototyp ist absichtlich als neue, dependency-freie Web-App aufgebaut.

## Lokal starten

```sh
python3 -m http.server 4317 --directory dist
```

Danach `http://localhost:4317` öffnen.

## GitHub Pages

Jeder Push nach `main`, der Dateien in `dist/` verändert, validiert und veröffentlicht die statische App über `.github/workflows/pages.yml`. Da alle Pfade relativ sind, funktioniert sie auch unter dem Projektpfad `https://ottenchris.github.io/myMandat/`.

Die politischen Antworten bleiben im `localStorage` des Browsers. Sie werden nicht von GitHub Actions verarbeitet oder ins Repository geschrieben. Browser-Speicher ist an den Origin gebunden: Daten der bisherigen Sites-Domain werden nicht zur GitHub-Pages-Domain übertragen. Außerdem teilen sich mehrere Projekt-Pages desselben GitHub-Kontos den Origin `ottenchris.github.io`; für einen Produktivbetrieb ist deshalb eine eigene Domain beziehungsweise ein eigener isolierter Origin empfehlenswert.

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

Alternativ kann unter **Actions → Import EP voting data → Run workflow** eine konkrete amtliche Sitzungs-ID eingegeben werden. Der Workflow validiert und committet den erzeugten Datensatz; anschließend veröffentlicht der Pages-Workflow den neuen Stand. Der Import ist absichtlich nicht zeitgesteuert, damit politische Inhalte vor der Veröffentlichung redaktionell kontrolliert werden können.

Die Produkt- und Datenstrategie steht in [RESEARCH_AND_PLAN.md](./RESEARCH_AND_PLAN.md).
Der konkrete Ablauf für Testpersonen steht in [TESTING.md](./TESTING.md).
