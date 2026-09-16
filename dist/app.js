const groups = {
  eu: [
    { id: 'greens', name: 'Grüne/EFA', color: '#2f8f67' },
    { id: 'renew', name: 'Renew Europe', color: '#e59f18' },
    { id: 'sd', name: 'S&D', color: '#d64747' },
    { id: 'epp', name: 'EVP', color: '#2767c7' },
    { id: 'ecr', name: 'EKR', color: '#315783' },
  ],
  bundestag: [
    { id: 'gruene', name: 'Bündnis 90/Die Grünen', color: '#41964b' },
    { id: 'spd', name: 'SPD', color: '#df4040' },
    { id: 'linke', name: 'Die Linke', color: '#a33a8c' },
    { id: 'union', name: 'CDU/CSU', color: '#31343a' },
    { id: 'afd', name: 'AfD', color: '#3183bd' },
  ],
}

const votes = {
  eu: [
    {
      id: 'eu-repair', status: 'open', date: 'Nächste Plenarsitzung', topic: 'Verbraucherschutz',
      title: 'Sollen Hersteller Reparaturen länger und einfacher ermöglichen?',
      short: 'Hersteller bestimmter Produkte sollen Reparaturen anbieten und Ersatzteile besser verfügbar machen.',
      context: 'Die Vorlage soll Reparaturen attraktiver machen, Elektroschrott senken und Verbraucherrechte stärken. Je nach Produkt gelten unterschiedliche Pflichten und Fristen.',
      forPoints: ['Längere Nutzung von Produkten', 'Weniger Abfall und Ressourcenverbrauch'],
      againstPoints: ['Zusätzliche Pflichten für Hersteller', 'Mögliche Mehrkosten bei Entwicklung und Logistik'],
      sources: [['Offizieller Vorgang', 'https://oeil.secure.europarl.europa.eu/'], ['EU-Parlament: Open Data', 'https://data.europarl.europa.eu/']],
      positions: { greens: 'yes', renew: 'yes', sd: 'yes', epp: 'yes', ecr: 'no' },
    },
    {
      id: 'eu-platform', status: 'closed', date: '24. April 2024', topic: 'Arbeit & Digitales',
      title: 'Neue Regeln für Beschäftigte auf digitalen Plattformen',
      short: 'Die EU regelt Arbeitsstatus und algorithmische Entscheidungen bei Plattformarbeit neu.',
      context: 'Im Mittelpunkt stehen die korrekte Einstufung von Beschäftigten und mehr Transparenz bei automatisierten Entscheidungen von Plattformen.',
      forPoints: ['Mehr Schutz vor Scheinselbstständigkeit', 'Nachvollziehbarere Algorithmen'],
      againstPoints: ['Weniger Flexibilität für einzelne Geschäftsmodelle', 'Umsetzungsaufwand für Plattformen'],
      result: { yes: 554, no: 56, abstain: 24 },
      sources: [['Offizielle Abstimmungsdaten', 'https://data.europarl.europa.eu/en/datasets']],
      positions: { greens: 'yes', renew: 'yes', sd: 'yes', epp: 'yes', ecr: 'no' },
    },
    {
      id: 'eu-nature', status: 'closed', date: '27. Februar 2024', topic: 'Umwelt',
      title: 'Geschädigte Ökosysteme in Europa wiederherstellen',
      short: 'Mitgliedstaaten sollen verbindliche Pläne zur Wiederherstellung von Naturflächen umsetzen.',
      context: 'Die Verordnung setzt Ziele für Land-, Küsten- und Süßwasserökosysteme. Die konkrete Umsetzung liegt weitgehend bei den Mitgliedstaaten.',
      forPoints: ['Schutz von Arten und Lebensräumen', 'Langfristig widerstandsfähigere Ökosysteme'],
      againstPoints: ['Konflikte mit landwirtschaftlicher Nutzung', 'Kosten und Flächenkonkurrenz'],
      result: { yes: 329, no: 275, abstain: 24 },
      sources: [['Offizielle Abstimmungsdaten', 'https://data.europarl.europa.eu/en/datasets']],
      positions: { greens: 'yes', renew: 'yes', sd: 'yes', epp: 'no', ecr: 'no' },
    },
    {
      id: 'eu-ai', status: 'closed', date: '13. März 2024', topic: 'Digitales',
      title: 'Einheitliche Regeln für Künstliche Intelligenz',
      short: 'KI-Systeme werden nach Risiken eingestuft; für Hochrisiko-Anwendungen gelten strengere Regeln.',
      context: 'Die Regeln kombinieren Verbote bestimmter Praktiken, Transparenzpflichten und Auflagen für risikoreiche Anwendungen.',
      forPoints: ['EU-weit einheitlicher Schutzrahmen', 'Mehr Transparenz bei risikoreicher KI'],
      againstPoints: ['Komplexe Compliance für Unternehmen', 'Risiko langsamerer Innovation'],
      result: { yes: 523, no: 46, abstain: 49 },
      sources: [['Offizielle Abstimmungsdaten', 'https://data.europarl.europa.eu/en/datasets']],
      positions: { greens: 'yes', renew: 'yes', sd: 'yes', epp: 'yes', ecr: 'abstain' },
    },
  ],
  bundestag: [
    {
      id: 'bt-energy', status: 'open', date: 'Beispiel für eine Sitzungswoche', topic: 'Energie',
      title: 'Soll die Stromsteuer für weitere Unternehmen gesenkt werden?',
      short: 'Der Vorschlag weitet eine steuerliche Entlastung aus und verändert deren Voraussetzungen.',
      context: 'Für eine echte Abstimmung würden hier Drucksache, Ausschussempfehlung und Haushaltswirkung getrennt verlinkt.',
      forPoints: ['Entlastung energieintensiver Betriebe', 'Möglicher Standortvorteil'],
      againstPoints: ['Weniger Steuereinnahmen', 'Auswahl der begünstigten Unternehmen'],
      sources: [['Bundestag: DIP', 'https://dip.bundestag.de/'], ['Namentliche Abstimmungen', 'https://www.bundestag.de/parlament/plenum/abstimmung']],
      positions: { gruene: 'no', spd: 'yes', linke: 'no', union: 'yes', afd: 'yes' },
    },
    {
      id: 'bt-bafog', status: 'closed', date: 'Beispieldatensatz', topic: 'Bildung',
      title: 'BAföG-Sätze und Freibeträge anheben', short: 'Ausbildungsförderung und Freibeträge sollen steigen.',
      context: 'Dieser Eintrag demonstriert den Bundestag-Adapter. Vor Produktivbetrieb muss er auf die konkrete Drucksache und Abstimmung gemappt werden.',
      forPoints: ['Mehr finanzielle Unterstützung', 'Größerer Kreis Anspruchsberechtigter'], againstPoints: ['Zusätzliche Haushaltsausgaben', 'Grundsätzliche Kritik am Fördersystem'],
      result: { yes: 372, no: 188, abstain: 43 }, sources: [['Bundestag Open Data', 'https://www.bundestag.de/services/opendata']],
      positions: { gruene: 'yes', spd: 'yes', linke: 'yes', union: 'no', afd: 'no' },
    },
    {
      id: 'bt-citizenship', status: 'closed', date: 'Beispieldatensatz', topic: 'Inneres',
      title: 'Einbürgerung nach kürzerer Aufenthaltsdauer ermöglichen', short: 'Die Mindestaufenthaltszeit für eine Einbürgerung wird unter Bedingungen verkürzt.',
      context: 'Der Vergleich berücksichtigt nur dokumentierte namentliche Stimmen. Abwesenheit ist keine Gegenstimme.',
      forPoints: ['Frühere politische Teilhabe', 'Anreiz für Integration'], againstPoints: ['Kritik an kürzeren Fristen', 'Höhere Anforderungen an Prüfung und Verwaltung'],
      result: { yes: 382, no: 234, abstain: 23 }, sources: [['Bundestag: Namentliche Abstimmungen', 'https://www.bundestag.de/parlament/plenum/abstimmung']],
      positions: { gruene: 'yes', spd: 'yes', linke: 'yes', union: 'no', afd: 'no' },
    },
  ],
}

const labels = { yes: 'Dafür', no: 'Dagegen', abstain: 'Enthalten' }
const state = { parliament: 'eu', view: 'today', expanded: 'eu-repair', userVotes: loadVotes() }
const content = document.querySelector('#app-content')
const title = document.querySelector('#page-title')

function loadVotes() {
  try { return JSON.parse(localStorage.getItem('mein-mandat-votes') || '{}') }
  catch { return {} }
}

function saveVotes() { localStorage.setItem('mein-mandat-votes', JSON.stringify(state.userVotes)) }
function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' })[c]) }

function resultMarkup(result) {
  if (!result) return ''
  const total = result.yes + result.no + result.abstain
  return `<div class="result-wrap"><div class="result-title"><span>Offizielles Ergebnis</span><small>${total} Stimmen</small></div><div class="result-bar" aria-label="Offizielles Abstimmungsergebnis"><span class="result-yes" style="width:${result.yes / total * 100}%"></span><span class="result-no" style="width:${result.no / total * 100}%"></span><span class="result-abstain" style="width:${result.abstain / total * 100}%"></span></div><div class="result-legend"><span><i class="yes-dot"></i>${result.yes} dafür</span><span><i class="no-dot"></i>${result.no} dagegen</span><span><i class="abstain-dot"></i>${result.abstain} enthalten</span></div></div>`
}

function voteCard(vote, compact = false) {
  const userVote = state.userVotes[vote.id]
  const expanded = state.expanded === vote.id
  const actions = Object.entries(labels).map(([value, label]) => `<button class="${value} ${userVote === value ? 'selected' : ''}" data-vote-id="${vote.id}" data-vote-value="${value}"><span>${value === 'yes' ? '✓' : value === 'no' ? '×' : '—'}</span>${label}</button>`).join('')
  const details = expanded ? `<div class="details"><div class="context"><h3>Worum geht es genau?</h3><p>${escapeHtml(vote.context)}</p></div><div class="perspectives"><div><h4>Argumente dafür</h4>${vote.forPoints.map(point => `<p><span>+</span>${escapeHtml(point)}</p>`).join('')}</div><div><h4>Argumente dagegen</h4>${vote.againstPoints.map(point => `<p><span>−</span>${escapeHtml(point)}</p>`).join('')}</div></div><div class="source-box"><div><span class="eyebrow">DO YOUR OWN RESEARCH</span><p>Die Kurzfassung ist nur ein Einstieg. Lies die Vorlage und prüfe Kontext, Änderungsanträge und Verfahren.</p></div><div>${vote.sources.map(([label, url]) => `<a href="${url}" target="_blank" rel="noreferrer">${escapeHtml(label)} ↗</a>`).join('')}</div></div></div>` : ''
  return `<article class="vote-card ${compact ? 'compact' : 'featured'}"><div class="vote-meta"><span>${escapeHtml(vote.topic)}</span><time>${escapeHtml(vote.date)}</time></div><h2>${escapeHtml(vote.title)}</h2><p class="lead">${escapeHtml(vote.short)}</p>${resultMarkup(vote.result)}<div class="question">Wie würdest du abstimmen?</div><div class="vote-actions">${actions}</div>${userVote ? '<div class="saved-message">✓ Lokal gespeichert · Du kannst deine Entscheidung jederzeit ändern.</div>' : ''}<button class="expand-button" data-expand="${vote.id}">${expanded ? 'Einordnung schließen ↑' : 'Einordnung & Quellen ansehen ↓'}</button>${details}</article>`
}

function renderToday() {
  const list = votes[state.parliament]
  const current = list.find(vote => vote.status === 'open') || list[0]
  const answered = list.filter(vote => state.userVotes[vote.id]).length
  return `<div class="content-grid"><section><div class="section-kicker"><span class="live-dot"></span> OFFENE ENTSCHEIDUNG</div>${voteCard(current)}</section><aside class="rail"><div class="stat-card dark"><span class="stat-label">DEIN TRACK RECORD</span><strong>${answered}</strong><span>Entscheidungen</span><button data-go="match">Vergleich ansehen <span>→</span></button></div><div class="info-card"><span class="eyebrow">DATENQUELLE</span><h3>${state.parliament === 'eu' ? 'EU zuerst ist der einfachere Start' : 'Bundestag bleibt anschließbar'}</h3><p>${state.parliament === 'eu' ? 'Offizielle strukturierte Daten verbinden Abstimmungen, Dokumente und Abgeordnete. Der Prototyp startet deshalb hier.' : 'DIP, Plenarprotokolle und XLSX-Namenslisten werden über einen eigenen Adapter normalisiert.'}</p></div><div class="principle"><span>↗</span><div><b>Selbst prüfen</b><small>Jede Zusammenfassung führt zu Primärquellen.</small></div></div></aside></div>`
}

function renderHistory() {
  const list = votes[state.parliament]
  const answered = list.filter(vote => state.userVotes[vote.id]).length
  return `<section class="history-list"><div class="history-intro"><p>Stimme auch nachträglich ab. Für deinen Vergleich zählt nur deine eigene Position – nicht, ob die Vorlage gewonnen hat.</p><span>${answered} von ${list.length} beantwortet</span></div>${list.map(vote => voteCard(vote, true)).join('')}</section>`
}

function calculateMatches() {
  const answered = votes[state.parliament].filter(vote => state.userVotes[vote.id])
  return groups[state.parliament].map(group => {
    const comparable = answered.filter(vote => vote.positions[group.id])
    const same = comparable.filter(vote => vote.positions[group.id] === state.userVotes[vote.id]).length
    return { ...group, count: comparable.length, score: comparable.length ? Math.round(same / comparable.length * 100) : 0 }
  }).sort((a, b) => b.score - a.score)
}

function renderMatch() {
  const answered = votes[state.parliament].filter(vote => state.userVotes[vote.id]).length
  const rankings = calculateMatches().map((item, index) => `<div class="ranking"><b>${index + 1}</b><span class="group-dot" style="background:${item.color}"></span><div><strong>${escapeHtml(item.name)}</strong><small>${item.count} vergleichbare Abstimmungen</small></div><div class="score-bar"><span style="width:${item.score}%;background:${item.color}"></span></div><em>${item.score}%</em></div>`).join('')
  const body = answered ? `<div class="rankings">${rankings}</div>` : `<div class="empty-state"><span>≈</span><p>Beantworte mindestens eine Abstimmung. Danach siehst du nachvollziehbar, welche Fraktionen genauso abgestimmt haben.</p><button data-go="history">Zu den Abstimmungen</button></div>`
  return `<section class="match-layout"><div class="match-card"><div class="match-head"><div><span class="eyebrow">BERECHNET AUF DEINEM GERÄT</span><h2>${answered ? `Aus ${answered} deiner Entscheidungen` : 'Noch kein Vergleich möglich'}</h2></div><span class="local-badge">◇ PRIVAT</span></div>${body}</div><div class="method-card"><span class="eyebrow">METHODIK IM PROTOTYP</span><h3>Einfach, sichtbar, nicht suggestiv</h3><ol><li>Nur identische Stimmen zählen als Übereinstimmung.</li><li>Enthaltung ist eine eigene Position.</li><li>Abwesenheit wird nicht als Gegenstimme gewertet.</li><li>Jede Prozentzahl zeigt ihre Datengrundlage.</li></ol><p class="warning">Vorschau mit Beispieldaten: Ein echtes Produkt sollte eine Rangliste erst ab mindestens 10 gemeinsamen Abstimmungen zeigen.</p><p>${state.parliament === 'eu' ? 'Später getrennt anzeigen: europäische Fraktion, nationale Partei und einzelne Abgeordnete.' : 'Beim Bundestag nur namentlich dokumentierte Einzelstimmen für Personen-Matches nutzen.'}</p></div></section>`
}

function renderPrivacy() {
  return `<section class="privacy-layout"><div class="privacy-hero"><span>◇</span><div><span class="eyebrow">LOCAL FIRST</span><h2>Deine politische Meinung gehört dir.</h2><p>Der Prototyp speichert deine Entscheidungen ausschließlich im lokalen Browser-Speicher. Es gibt kein Konto, kein Tracking und keinen Server-Upload.</p></div></div><div class="privacy-grid"><article><span>01</span><h3>Getrennte Datenwelten</h3><p>Öffentliche Parlamentsdaten werden geladen. Deine privaten Entscheidungen werden nur lokal damit verglichen.</p></article><article><span>02</span><h3>Keine personalisierte KI</h3><p>Zusammenfassungen beziehen sich auf Dokumente, nie auf dein Profil. Eine KI soll deine Haltung weder sehen noch erraten.</p></article><article><span>03</span><h3>Export unter deiner Kontrolle</h3><p>Ein späterer verschlüsselter Export oder iCloud-Sync wäre freiwillig und standardmäßig ausgeschaltet.</p></article><article><span>04</span><h3>Offene Methodik</h3><p>Quellcode, Datenquellen und Matching-Regeln sollten öffentlich prüfbar sein.</p></article></div><div class="danger-zone"><div><b>Lokales Profil zurücksetzen</b><p>Löscht alle im Prototyp gespeicherten Entscheidungen von diesem Gerät.</p></div><button data-reset>Alle lokalen Daten löschen</button></div></section>`
}

function render() {
  title.textContent = ({ today:'Dein digitales Mandat', history:'Deine Entscheidungen', match:'Wer stimmt wie du?', privacy:'Privat by Design' })[state.view]
  document.querySelectorAll('[data-view]').forEach(button => button.classList.toggle('active', button.dataset.view === state.view))
  document.querySelectorAll('[data-parliament]').forEach(button => button.classList.toggle('active', button.dataset.parliament === state.parliament))
  content.innerHTML = ({ today: renderToday, history: renderHistory, match: renderMatch, privacy: renderPrivacy })[state.view]()
}

function toast(message) {
  const element = document.querySelector('#toast')
  element.textContent = message
  element.classList.add('visible')
  window.clearTimeout(toast.timer)
  toast.timer = window.setTimeout(() => element.classList.remove('visible'), 2800)
}

document.addEventListener('click', event => {
  const view = event.target.closest('[data-view]')
  if (view) { state.view = view.dataset.view; render(); return }
  const parliament = event.target.closest('[data-parliament]')
  if (parliament) { state.parliament = parliament.dataset.parliament; state.view = 'today'; state.expanded = votes[state.parliament][0].id; render(); return }
  const vote = event.target.closest('[data-vote-id]')
  if (vote) { state.userVotes[vote.dataset.voteId] = vote.dataset.voteValue; saveVotes(); render(); toast('Deine Entscheidung wurde nur auf diesem Gerät gespeichert.'); return }
  const expand = event.target.closest('[data-expand]')
  if (expand) { state.expanded = state.expanded === expand.dataset.expand ? '' : expand.dataset.expand; render(); return }
  const go = event.target.closest('[data-go]')
  if (go) { state.view = go.dataset.go; render(); return }
  if (event.target.closest('[data-reset]')) { state.userVotes = {}; localStorage.removeItem('mein-mandat-votes'); render(); toast('Lokales Profil gelöscht.'); }
})

render()
