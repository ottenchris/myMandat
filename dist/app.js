const labels = { yes: 'Dafür', no: 'Dagegen', abstain: 'Enthalten' }
const STORAGE_KEY = 'mein-mandat-votes'
const SKIP_KEY = 'mein-mandat-skipped'
const ONBOARDING_KEY = 'mein-mandat-test-onboarding'
const NOTES_KEY = 'mein-mandat-test-notes'

const state = {
  view: 'today',
  expanded: '',
  fullText: '',
  userVotes: readLocal(STORAGE_KEY, {}),
  skipped: readLocal(SKIP_KEY, []),
  dataset: null,
  loading: true,
  error: '',
}

const content = document.querySelector('#app-content')
const title = document.querySelector('#page-title')
const dataStatus = document.querySelector('#data-status')
const testerDialog = document.querySelector('#tester-dialog')

function readLocal(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback }
  catch { return fallback }
}

function saveVotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.userVotes))
}

function saveSkipped() {
  localStorage.setItem(SKIP_KEY, JSON.stringify(state.skipped))
}

function nextPendingId() {
  return state.dataset?.votes.find(vote => !state.userVotes[vote.id] && !state.skipped.includes(vote.id))?.id || ''
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character])
}

function formatDate(value) {
  return new Intl.DateTimeFormat('de-DE', { dateStyle: 'long' }).format(new Date(`${value}T12:00:00`))
}

function resultMarkup(result, visible) {
  if (!visible) return `<div class="result-locked"><span>◌</span><div><b>Amtliches Ergebnis verdeckt</b><small>Wird nach deiner Entscheidung sichtbar, damit du unbeeinflusst abstimmst.</small></div></div>`
  const total = result.yes + result.no + result.abstain
  return `<div class="result-wrap"><div class="result-title"><span>Amtliches Ergebnis</span><small>${total} abgegebene Stimmen</small></div><div class="result-bar" aria-label="Amtliches Abstimmungsergebnis"><span class="result-yes" style="width:${result.yes / total * 100}%"></span><span class="result-no" style="width:${result.no / total * 100}%"></span><span class="result-abstain" style="width:${result.abstain / total * 100}%"></span></div><div class="result-legend"><span><i class="yes-dot"></i>${result.yes} dafür</span><span><i class="no-dot"></i>${result.no} dagegen</span><span><i class="abstain-dot"></i>${result.abstain} enthalten</span></div></div>`
}

function groupMarkup(vote) {
  const rows = state.dataset.groups.map(group => {
    const tally = vote.groupTallies[group.id]
    const majority = tally.position ? labels[tally.position] : 'Keine klare Mehrheit'
    return `<div class="group-row"><span class="group-dot" style="background:${group.color}"></span><div><b>${escapeHtml(group.name)}</b><small>${escapeHtml(group.fullName)}</small></div><strong class="group-position ${tally.position || ''}">${escapeHtml(majority)}</strong><span>${tally.yes}/${tally.no}/${tally.abstain}</span></div>`
  }).join('')
  return `<div class="group-breakdown"><div class="group-head"><div><h3>So stimmten die Fraktionen</h3><p>Mehrheitsposition aus den zugeordneten Einzelstimmen.</p></div><small>Ja / Nein / Enthaltung</small></div>${rows}</div>`
}

function voteCard(vote, compact = false) {
  const userVote = state.userVotes[vote.id]
  const skipped = state.skipped.includes(vote.id)
  const expanded = state.expanded === vote.id
  const fullTextVisible = state.fullText === vote.id
  const actions = Object.entries(labels).map(([value, label]) => `<button class="${value} ${userVote === value ? 'selected' : ''}" data-vote-id="${vote.id}" data-vote-value="${value}"><span>${value === 'yes' ? '✓' : value === 'no' ? '×' : '—'}</span>${label}</button>`).join('')
  const sources = vote.sources.map(source => `<a href="${source.url}" target="_blank" rel="noreferrer">${escapeHtml(source.label)} ↗</a>`).join('')
  const fullText = fullTextVisible && vote.documentEmbedUrl ? `<div class="fulltext-frame"><div><b>Amtlicher Volltext</b><small>Wird auf deinen Klick direkt vom Europäischen Parlament geladen.</small></div><iframe src="${vote.documentEmbedUrl}" title="Amtlicher Volltext: ${escapeHtml(vote.title)}" loading="lazy" referrerpolicy="no-referrer" sandbox="allow-same-origin allow-scripts allow-popups"></iframe><a href="${vote.documentEmbedUrl}" target="_blank" rel="noreferrer">Falls die Einbettung nicht lädt: Volltext öffnen ↗</a></div>` : ''
  const documentDescription = vote.documentDescription || vote.documentTitle || vote.officialDecision
  const details = expanded ? `<div class="details"><div class="context"><span class="eyebrow">AMTLICHES DOKUMENT</span><h3>${escapeHtml(vote.documentTitle || vote.officialDecision)}</h3><p>${escapeHtml(documentDescription)}</p><p class="decision-reference"><b>Abgestimmt wurde:</b> ${escapeHtml(vote.officialDecision)}</p>${vote.documentEmbedUrl ? `<button class="fulltext-button" data-fulltext="${vote.id}">${fullTextVisible ? 'Volltext ausblenden ↑' : 'Amtlichen Volltext hier anzeigen ↓'}</button>` : ''}</div>${fullText}${userVote ? groupMarkup(vote) : ''}<div class="source-box"><div><span class="eyebrow">DO YOUR OWN RESEARCH</span><p>Prüfe Vorlage, Änderungsanträge und Verfahren in den Primärquellen. Die App zeigt Herkunft und Berechnung offen an.</p></div><div>${sources}</div></div></div>` : ''
  const skipControl = userVote ? '' : skipped ? `<div class="skip-row"><span>↷ Übersprungen · zählt nicht als Position</span><button data-unskip-id="${vote.id}">Wieder vorlegen</button></div>` : `<div class="skip-row"><span>Noch nicht sicher?</span><button data-skip-id="${vote.id}">Überspringen →</button></div>`
  return `<article class="vote-card ${compact ? 'compact' : 'featured'} ${skipped ? 'is-skipped' : ''}"><div class="vote-meta"><span>${escapeHtml(vote.topic)}</span><time>${formatDate(vote.date)}</time></div><h2>${escapeHtml(vote.title)}</h2><p class="lead">${escapeHtml(vote.short)}</p>${resultMarkup(vote.result, Boolean(userVote))}<div class="question">Wie hättest du abgestimmt?</div><div class="vote-actions">${actions}</div>${skipControl}${userVote ? `<div class="saved-message">✓ Nur lokal gespeichert · Deine Position: ${labels[userVote]}</div>` : ''}<button class="expand-button" data-expand="${vote.id}">${expanded ? 'Details & Volltext schließen ↑' : 'Beschreibung & Volltext ansehen ↓'}</button>${details}</article>`
}

function renderToday() {
  const votes = state.dataset.votes
  const current = votes.find(vote => !state.userVotes[vote.id] && !state.skipped.includes(vote.id))
  const answered = votes.filter(vote => state.userVotes[vote.id]).length
  const skipped = votes.filter(vote => state.skipped.includes(vote.id) && !state.userVotes[vote.id]).length
  const main = current ? `<div class="section-kicker"><span class="live-dot"></span> DEINE NÄCHSTE ENTSCHEIDUNG</div>${voteCard(current)}` : `<div class="done-state"><span>✓</span><h2>Für den Moment bist du durch.</h2><p>Du hast alle Entscheidungen beantwortet oder übersprungen.</p><div><button data-go="match">Vergleich ansehen</button>${skipped ? '<button class="secondary" data-revisit-skipped>Übersprungene erneut ansehen</button>' : ''}</div></div>`
  return `<div class="content-grid"><section>${main}</section><aside class="rail"><div class="stat-card dark"><span class="stat-label">DEIN TESTFORTSCHRITT</span><strong>${answered}<small>/${votes.length}</small></strong><span>Entscheidungen · ${skipped} übersprungen</span><button data-go="match">Vergleich ansehen <span>→</span></button></div><div class="info-card verified"><span class="eyebrow">VERIFIZIERTE QUELLE</span><h3>Amtliche EU-Daten, lokal verglichen</h3><p>Ergebnisse und Einzelstimmen stammen aus der Open-Data-API des Europäischen Parlaments. Deine Haltung bleibt auf diesem Gerät.</p><a href="${state.dataset.source.url}" target="_blank" rel="noreferrer">API-Dokumentation ↗</a></div><div class="principle"><span>↗</span><div><b>Selbst prüfen</b><small>Jede Entscheidung führt zu Primärquellen.</small></div></div></aside></div>`
}

function renderHistory() {
  const votes = state.dataset.votes
  const answered = votes.filter(vote => state.userVotes[vote.id]).length
  const skipped = votes.filter(vote => state.skipped.includes(vote.id) && !state.userVotes[vote.id]).length
  return `<section class="history-list"><div class="history-intro"><p>Alle Abstimmungen fanden bereits statt. Du beantwortest sie rückblickend, ohne das amtliche Ergebnis vorher zu sehen. Überspringen zählt nicht als politische Position.</p><span>${answered} beantwortet · ${skipped} übersprungen</span></div>${votes.map(vote => voteCard(vote, true)).join('')}</section>`
}

function calculateMatches() {
  const answered = state.dataset.votes.filter(vote => state.userVotes[vote.id])
  return state.dataset.groups.map(group => {
    const comparable = answered.filter(vote => vote.positions[group.id])
    const same = comparable.filter(vote => vote.positions[group.id] === state.userVotes[vote.id]).length
    return { ...group, count: comparable.length, score: comparable.length ? Math.round(same / comparable.length * 100) : 0 }
  }).sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
}

function renderMatch() {
  const answered = state.dataset.votes.filter(vote => state.userVotes[vote.id]).length
  const rankings = calculateMatches().map((item, index) => `<div class="ranking"><b>${index + 1}</b><span class="group-dot" style="background:${item.color}"></span><div><strong>${escapeHtml(item.name)}</strong><small>${item.count} vergleichbare Abstimmungen</small></div><div class="score-bar"><span style="width:${item.score}%;background:${item.color}"></span></div><em>${item.score}%</em></div>`).join('')
  const body = answered ? `<div class="rankings">${rankings}</div>` : `<div class="empty-state"><span>≈</span><p>Beantworte mindestens eine Abstimmung. Danach siehst du, welche Fraktionsmehrheiten genauso entschieden haben.</p><button data-go="history">Zu den Abstimmungen</button></div>`
  return `<section class="match-layout"><div class="match-card"><div class="match-head"><div><span class="eyebrow">BERECHNET AUF DEINEM GERÄT</span><h2>${answered ? `Aus ${answered} deiner Entscheidungen` : 'Noch kein Vergleich möglich'}</h2></div><span class="local-badge">◇ PRIVAT</span></div>${body}</div><div class="method-card"><span class="eyebrow">METHODIK IM TEST</span><h3>Einfach und nachrechenbar</h3><ol><li>Eine Fraktionsposition ist die Mehrheit ihrer zugeordneten Einzelstimmen.</li><li>Nur identische Positionen zählen als Übereinstimmung.</li><li>Enthaltung ist eine eigene Position.</li><li>Abwesenheit zählt nicht als Gegenstimme.</li></ol><p class="warning">Mit wenigen Entscheidungen ist der Prozentwert instabil. Er ist keine Wahl- oder Parteientfehlung.</p><p>${escapeHtml(state.dataset.methodology)}</p></div></section>`
}

function renderPrivacy() {
  const answered = state.dataset.votes.filter(vote => state.userVotes[vote.id]).length
  return `<section class="privacy-layout"><div class="privacy-hero"><span>◇</span><div><span class="eyebrow">LOCAL FIRST</span><h2>Deine politische Meinung gehört dir.</h2><p>Diese Testversion speichert Entscheidungen und optionale Testnotizen ausschließlich im lokalen Browser-Speicher. Es gibt kein Konto, kein Tracking, keine Cookies und keinen Server-Upload deiner Antworten.</p></div></div><div class="privacy-grid"><article><span>01</span><h3>Öffentlich rein, privat bleibt privat</h3><p>Die Website liefert nur öffentliche Parlamentsdaten. Der Vergleich mit deinen Antworten läuft im Browser.</p></article><article><span>02</span><h3>Kein politisches Profil</h3><p>Die Betreiber erhalten weder deine Einzelstimmen noch den daraus berechneten Fraktionsvergleich.</p></article><article><span>03</span><h3>Offene Methodik</h3><p>Quelle, Datenstand und Rechenregel werden direkt in der App ausgewiesen.</p></article><article><span>04</span><h3>Bewusst begrenzter Test</h3><p>Noch keine Push-Nachrichten, kein Sync und keine KI-Zusammenfassungen. Diese Funktionen brauchen vorab ein eigenes Datenschutzdesign.</p></article></div><div class="feedback-card"><div><span class="eyebrow">TESTER-FEEDBACK</span><h3>Was war unklar oder hat gefehlt?</h3><p>Die Notiz bleibt lokal. „Feedback kopieren“ legt einen Text in deine Zwischenablage, den du freiwillig über deinen vereinbarten Kanal senden kannst.</p></div><textarea data-test-notes rows="5" placeholder="Zum Beispiel: Ich konnte nicht erkennen, worüber genau abgestimmt wurde …">${escapeHtml(localStorage.getItem(NOTES_KEY) || '')}</textarea><div class="feedback-actions"><button data-copy-feedback>Feedback kopieren</button><small>${answered}/${state.dataset.votes.length} Entscheidungen beantwortet · keine Einzelstimmen werden in den Feedbacktext aufgenommen</small></div></div><div class="danger-zone"><div><b>Alle lokalen Testdaten zurücksetzen</b><p>Löscht Entscheidungen, Notiz und den Onboarding-Status von diesem Gerät.</p></div><button data-reset>Lokale Daten löschen</button></div></section>`
}

function renderLoading() {
  return `<div class="loading-state"><span></span><h2>Amtliche Abstimmungsdaten werden geladen</h2><p>Die App lädt einen statischen, geprüften Datenstand. Deine Antworten werden dabei nicht übertragen.</p></div>`
}

function renderError() {
  return `<div class="error-state"><span>!</span><h2>Der Abstimmungsdatensatz konnte nicht geladen werden.</h2><p>${escapeHtml(state.error)}</p><button data-retry>Erneut versuchen</button></div>`
}

function render() {
  const titles = { today: 'Dein digitales Mandat', history: 'Deine Entscheidungen', match: 'Wer stimmt wie du?', privacy: 'Privat by Design' }
  title.textContent = titles[state.view]
  document.querySelectorAll('[data-view]').forEach(button => button.classList.toggle('active', button.dataset.view === state.view))
  if (state.loading) content.innerHTML = renderLoading()
  else if (state.error) content.innerHTML = renderError()
  else content.innerHTML = ({ today: renderToday, history: renderHistory, match: renderMatch, privacy: renderPrivacy })[state.view]()
}

function toast(message) {
  const element = document.querySelector('#toast')
  element.textContent = message
  element.classList.add('visible')
  window.clearTimeout(toast.timer)
  toast.timer = window.setTimeout(() => element.classList.remove('visible'), 3200)
}

function showOnboarding() {
  if (localStorage.getItem(ONBOARDING_KEY)) return
  try { testerDialog.showModal() }
  catch { testerDialog.setAttribute('open', '') }
}

async function loadDataset() {
  state.loading = true
  state.error = ''
  render()
  try {
    const response = await fetch('./data/ep-votes.json', { cache: 'no-store' })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const dataset = await response.json()
    if (!Array.isArray(dataset.votes) || dataset.votes.length < 1) throw new Error('Ungültiges Datenformat')
    state.dataset = dataset
    state.expanded = dataset.votes[0].id
    dataStatus.textContent = `TESTVERSION · AMTLICHE DATEN · STAND ${new Intl.DateTimeFormat('de-DE').format(new Date(`${dataset.meetingDate}T12:00:00`))}`
  } catch (error) {
    state.error = `Bitte prüfe deine Verbindung und lade die Seite neu. (${error.message})`
    dataStatus.textContent = 'TESTVERSION · DATENFEHLER'
  } finally {
    state.loading = false
    render()
    if (!state.error) showOnboarding()
  }
}

function copyFeedback() {
  const notes = document.querySelector('[data-test-notes]')?.value.trim() || ''
  const answered = state.dataset.votes.filter(vote => state.userVotes[vote.id]).length
  const text = `Mein-Mandat-Testfeedback\n\nGetesteter Datenstand: ${state.dataset.meetingDate}\nAbgeschlossene Entscheidungen: ${answered}/${state.dataset.votes.length}\n\nBeobachtung:\n${notes || '(keine Notiz)'}\n\nHinweis: Dieser Text enthält keine meiner politischen Einzelentscheidungen.`
  navigator.clipboard.writeText(text).then(() => toast('Feedbacktext kopiert – keine Einzelstimmen enthalten.')).catch(() => toast('Kopieren war nicht möglich. Markiere den Text bitte manuell.'))
}

document.addEventListener('input', event => {
  if (event.target.matches('[data-test-notes]')) localStorage.setItem(NOTES_KEY, event.target.value)
})

document.addEventListener('click', event => {
  const start = event.target.closest('[data-start-test]')
  if (start) { localStorage.setItem(ONBOARDING_KEY, '1'); testerDialog.close(); return }
  const view = event.target.closest('[data-view]')
  if (view) { state.view = view.dataset.view; render(); return }
  const vote = event.target.closest('[data-vote-id]')
  if (vote) {
    state.userVotes[vote.dataset.voteId] = vote.dataset.voteValue
    state.skipped = state.skipped.filter(id => id !== vote.dataset.voteId)
    saveVotes()
    saveSkipped()
    state.expanded = nextPendingId()
    state.fullText = ''
    render()
    toast('Nur auf diesem Gerät gespeichert. Das amtliche Ergebnis ist jetzt sichtbar.')
    return
  }
  const skip = event.target.closest('[data-skip-id]')
  if (skip) {
    if (!state.skipped.includes(skip.dataset.skipId)) state.skipped.push(skip.dataset.skipId)
    saveSkipped()
    state.expanded = nextPendingId()
    state.fullText = ''
    render()
    toast('Übersprungen – nicht als Position gewertet.')
    return
  }
  const unskip = event.target.closest('[data-unskip-id]')
  if (unskip) {
    state.skipped = state.skipped.filter(id => id !== unskip.dataset.unskipId)
    saveSkipped()
    render()
    toast('Die Entscheidung wird wieder vorgelegt.')
    return
  }
  const fullText = event.target.closest('[data-fulltext]')
  if (fullText) { state.fullText = state.fullText === fullText.dataset.fulltext ? '' : fullText.dataset.fulltext; render(); return }
  const expand = event.target.closest('[data-expand]')
  if (expand) { state.expanded = state.expanded === expand.dataset.expand ? '' : expand.dataset.expand; if (!state.expanded) state.fullText = ''; render(); return }
  const go = event.target.closest('[data-go]')
  if (go) { state.view = go.dataset.go; render(); return }
  if (event.target.closest('[data-copy-feedback]')) { copyFeedback(); return }
  if (event.target.closest('[data-retry]')) { loadDataset(); return }
  if (event.target.closest('[data-revisit-skipped]')) { state.skipped = []; saveSkipped(); render(); toast('Übersprungene Entscheidungen sind wieder offen.'); return }
  if (event.target.closest('[data-reset]')) {
    state.userVotes = {}
    state.skipped = []
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(SKIP_KEY)
    localStorage.removeItem(NOTES_KEY)
    localStorage.removeItem(ONBOARDING_KEY)
    render()
    toast('Alle lokalen Testdaten wurden gelöscht.')
  }
})

loadDataset()
