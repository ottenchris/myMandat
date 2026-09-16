# Recherche und Umsetzungsplan

Stand: 16. September 2026

## Kurzentscheidung

**Mit dem EU-Parlament starten, den Kern aber als parlament-unabhängige Engine bauen.**

Für Personen- und Fraktionsmatching ist das EU-Parlament der technisch bessere MVP: Das offizielle Open-Data-Portal bietet eine aktuelle REST-API, strukturierte Datensätze für Abgeordnete, Plenardokumente und Abstimmungsergebnisse sowie persistente IDs. Die Bereitstellung wird laut Release Notes nahe Echtzeit automatisiert. Die API umfasst allerdings nur Roll-Call-Votes; geheime und andere nicht namentlich protokollierte Abstimmungen erlauben keinen Personenvergleich.

Beim Bundestag sind Dokumente und Verfahren über DIP gut erschlossen, aber ein API-Key ist erforderlich. Namentliche Einzelstimmen werden offiziell als XLSX/PDF veröffentlicht und sind gegenüber allen Abstimmungen der Ausnahmefall. Für Fraktionsvergleiche bleibt der Bundestag gut machbar; für Personenvergleiche muss die geringere Datenbasis sichtbar sein.

## Datenquellen

### EU-Parlament

- [Open Data API](https://data.europarl.europa.eu/en/developer-corner/opendata-api)
- [Datensätze](https://data.europarl.europa.eu/en/datasets)
- [Release Notes](https://data.europarl.europa.eu/release-notes)
- [Legislative Observatory](https://oeil.secure.europarl.europa.eu/)
- [Wie Abstimmungen verfolgt werden können](https://www.europarl.europa.eu/topics/en/article/20240513STO21505/how-to-follow-the-activities-and-votes-of-your-mep)

Stärken: offizielle API, strukturierte Mitglieder-/Fraktionsdaten, mehrsprachige Dokumente, persistente Referenzen, viele namentliche Schlussabstimmungen.

Risiken: mehrere Abstimmungen und Änderungsanträge je Vorgang; nationale Partei und EU-Fraktion sind getrennte Ebenen; semantisch missverständliche Titel; nicht jede Stimme ist namentlich.

### Deutscher Bundestag

- [Bundestag Open Data](https://www.bundestag.de/services/opendata)
- [DIP API](https://dip.bundestag.de/%C3%BCber-dip/hilfe/api)
- [Namentliche Abstimmungen](https://www.bundestag.de/parlament/plenum/abstimmung)
- [abgeordnetenwatch API](https://www.abgeordnetenwatch.de/api) als sekundäre, CC0-lizenzierte Komfortquelle

Stärken: sehr gute Dokumentabdeckung, Plenarprotokolle und Drucksachen, transparente nationale Parteien-/Fraktionsstruktur.

Risiken: DIP-Key; namentliche Stimmen als separate XLSX-Dateien; nur ein Teil aller Abstimmungen ist personenbezogen auswertbar; Termin- und Ergebnisdaten müssen aus mehreren Quellen zusammengeführt werden.

## Marktbild und Differenzierung

Die Grundidee ist nicht mehr unbesetzt:

- [DEMOCRACY](https://democracy-deutschland.de/) deckt für den Bundestag Vorabstimmungen, Benachrichtigungen sowie Partei-/Abgeordnetenvergleich sehr ähnlich ab. Laut Store-Beschreibung bleiben individuelle Entscheidungen lokal, Community-Stimmen werden aber anonymisiert an einen Server übertragen.
- [Real-O-Mat](https://real-o-mat.de/methodik/) vergleicht ausgewählte eigene Positionen mit realem Fraktionsverhalten, ist aber primär ein kuratiertes Wahlperioden-Produkt.
- [TrackMyEU](https://trackmyeu.org/) fokussiert auf EU-Vorgänge, Suche und persönliche Dashboards.
- [Where's My MEP](https://www.wheresmymep.eu/) und [MEPWatch](https://mepwatch.eu/) machen individuelle EU-Abstimmungsdaten zugänglich, aber nicht denselben strikt lokalen, kontinuierlichen persönlichen Wahl-O-Mat zum Hauptprodukt.

Die glaubwürdige Positionierung:

1. **Zero-knowledge Profil:** Keine politische Entscheidung verlässt das Gerät.
2. **EU-first:** eine Lücke gegenüber der Bundestag-zentrierten DEMOCRACY-App.
3. **Quellen vor KI:** Jede Aussage führt zu Primärdokumenten und konkreten Abstimmungs-IDs.
4. **Offene Methodik:** Matching-Code, Datenmodell und Korrekturhistorie sind auditierbar.
5. **Keine Community-Rangliste im MVP:** Sie benötigt Server und Sybil-Schutz und wirkt leicht fälschlich repräsentativ.

## Datenschutz- und Sicherheitsarchitektur

Politische Meinungen sind besondere Kategorien personenbezogener Daten nach [Art. 9 DSGVO](https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32016R0679). Auch aus Abstimmungen abgeleitete politische Präferenzen sind sensibel; der EDPB behandelt inferierte politische Meinungen ebenfalls als besondere Daten.

    Amtliche Quellen -> reproduzierbare Import-Pipeline -> signiertes öffentliches Datenpaket
                                                            |
                                                            v
    Gerät: Datenpaket + lokale Stimmen -> lokales Matching -> lokale Darstellung
                         (niemals Upload)

- Native App: SQLite/Core Data, Dateischutz des Betriebssystems, optionaler App-Lock; Backups standardmäßig ausschließen oder Ende-zu-Ende verschlüsseln.
- Web/PWA: IndexedDB statt localStorage, Content Security Policy, keine Drittanbieter-Skripte, externen Fonts, Analytics oder inhaltsreichen Crash-Reports.
- KI-Zusammenfassungen werden zentral nur aus öffentlichen Dokumenten generiert, redaktionell geprüft und als gemeinsamer Content ausgeliefert. Das Nutzungsprofil wird nie an ein Modell gesendet.
- Export nur als lokal verschlüsselte Datei mit vom Nutzer gesetztem Schlüssel.
- iCloud später nur Opt-in. CloudKit unterstützt verschlüsselte Felder in privaten Datenbanken, ist aber trotzdem Cloud-Verarbeitung.

### Push-Benachrichtigungen

Echte sofortige Remote-Pushs werden bei Apple von einem Provider-Server über APNs ausgelöst. Lokale Notifications kann das Gerät terminieren, aber das Abfragen unregelmäßig neuer Parlamentsdaten per Background Refresh ist nicht garantiert.

Empfehlung:

- Das Gerät liest einen öffentlichen, signierten Feed.
- Zunächst manuelle Aktualisierung plus opportunistischer Background Refresh und lokale Notification.
- Später optionaler Broadcast-Push: derselbe inhaltsarme Hinweis an alle Geräte, keine Themen-Abos, keine Nutzerkennung im eigenen Backend, keine politische Position im Payload.

[Apple dokumentiert](https://developer.apple.com/documentation/usernotifications/) die Trennung zwischen lokal und serverseitig erzeugten Notifications und weist darauf hin, dass Zustellung nicht garantiert ist.

## Ziel-Datenmodell

    ParliamentSource: id, jurisdiction, language, sourceVersion
    Procedure: id, title, stage, topics, officialDocuments
    Division: id, procedureId, timestamp, question, kind, eligibleChoices, result
    Representative: id, name, nationalParty, parliamentaryGroup, mandatePeriod
    RecordedVote: divisionId, representativeId, choice, correctionState, source
    LocalUserVote: divisionId, choice, decidedAt, importance, note

IDs der Parlamente bleiben mit Source-Präfix erhalten. Keine Heuristik darf Vorgänge still zusammenführen. Korrekturen amtlicher Stimmen werden versioniert.

## Seriöse Matching-Regeln

- Dafür, dagegen und enthalten getrennt behandeln.
- Abwesend, entschuldigt und nicht stimmberechtigt nicht als politische Position werten.
- Prozentwert = identische Entscheidungen / tatsächlich vergleichbare Entscheidungen.
- Immer Nenner und Konfidenz anzeigen; unter 10 gemeinsamen Abstimmungen keine Rangliste.
- Optionale lokale Gewichtung; ungewichtetes Ergebnis bleibt sichtbar.
- EU: nationale Partei, europäische Fraktion und Person getrennt vergleichen.
- Kein „Diese Partei solltest du wählen“, sondern „Bei 18 vergleichbaren namentlichen Stimmen lag dieselbe Position vor“.

## Lieferplan

### Phase 0 – Validierung (2–3 Wochen)

- 8–12 qualitative Interviews und Usability-Tests.
- 100 reale EU-Schlussabstimmungen durch den Importer laufen lassen.
- Methodik mit Parlamentsdaten-, politischer Bildungs-, Datenschutz- und Barrierefreiheits-Fachleuten prüfen.
- Metriken: Verständnis, Quellenöffnungsrate, wahrgenommene Neutralität, Wiederkehrabsicht.

### Phase 1 – EU-Web/PWA-MVP (8–12 Wochen)

- EP Open Data Import, IndexedDB, Offline-Datenpakete.
- Kuratierte Schlussabstimmungen statt jedes Änderungsantrags.
- Verlauf, Fraktions-/Abgeordnetenmatching, Quellenansicht, lokaler Export.
- Keine Konten, Community-Ergebnisse oder personalisierte KI.

### Phase 2 – Native Apps (8–12 Wochen)

- Native Hülle, Kotlin Multiplatform oder Flutter erst nach PWA-Validierung entscheiden.
- Geräteschutz, App-Lock, Background Refresh, lokale Notifications.
- Optionaler Broadcast-Push nach Datenschutz-Folgenabschätzung.

### Phase 3 – Bundestag-Adapter

- DIP-Vorgänge, Plenarprotokolle und namentliche XLSX-Listen normalisieren.
- Gegen abgeordnetenwatch testen, amtliche Quellen bleiben Wahrheitsschicht.
- Datenabdeckung pro Person/Fraktion sichtbar machen.

## Technische Empfehlung

Nicht vom Hackathon-Frontend migrieren. Empfohlene Trennung:

- packages/domain: Typen, Matching, Validierung
- packages/import-ep: reproduzierbarer EU-Importer
- packages/import-bt: Bundestag-Importer
- apps/web: PWA, IndexedDB, Offline-Support
- apps/mobile: erst nach validiertem Nutzungsmuster
- data/releases: signierte, versionierte öffentliche Datenpakete

Statisches Hosting für öffentliche Datenpakete ist mit „kein Backend für politische Nutzerdaten“ vereinbar: **Content-Infrastruktur ja, Nutzerprofil-Server nein.**

## Finanzierung

- Der [Prototype Fund](https://www.prototypefund.de/) passt zu Open Source, Public Interest Tech, Datensicherheit und Software-Infrastruktur. Die konkrete Runde und Voraussetzungen müssen bei Bewerbung geprüft werden.
- Das EU-Programm [Citizens, Equality, Rights and Values (CERV)](https://commission.europa.eu/funding-and-tenders/find-funding/eu-funding-programmes/citizens-equality-rights-and-values-programme_en) fördert demokratische und zivilgesellschaftliche Beteiligung. Das Arbeitsprogramm 2026–2027 enthält einen Call zu Bürgerengagement und Teilhabe; ein zivilgesellschaftliches Konsortium ist voraussichtlich geeigneter als ein reines Startup.
- Sinnvolle Partner: politische Bildungsorganisation, Universität/Methodik, Datenschutz-/Digitalrechte-NGO und eine Organisation aus einem zweiten EU-Mitgliedstaat.

## Unmittelbar nächste Entscheidungen

1. Ohne Community-Ergebnisse starten? Empfehlung: ja.
2. Open Source als Vertrauensversprechen? Empfehlung: ja, mindestens Importer, Datenmodell und Matching.
3. Wer trägt redaktionelle Verantwortung für neutrale Zusammenfassungen und Korrekturen?
4. Welcher institutionelle Partner ermöglicht Glaubwürdigkeit und CERV-Förderung?

Dies ist eine Produkt- und Technikbewertung, keine Rechtsberatung. Vor Veröffentlichung sollten DSGVO-Rollen, Datenschutz-Folgenabschätzung, App-Store-Erklärungen und Lizenzbedingungen fachjuristisch geprüft werden.
