import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const MEETING_ID = process.env.EP_MEETING_ID || 'MTG-PL-2026-09-15'
const MEP_CSV_URL = 'https://data.europarl.europa.eu/distribution/meps_10_83_en.csv'
const API_BASE = 'https://data.europarl.europa.eu/api/v2'
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUTPUT = resolve(ROOT, 'dist/data/ep-votes.json')

const groups = [
  { id: 'epp', name: 'EVP', fullName: 'Europäische Volkspartei', color: '#1f6bc8', sourceName: 'Group of the European People\'s Party (Christian Democrats)' },
  { id: 'sd', name: 'S&D', fullName: 'Progressive Allianz der Sozialdemokraten', color: '#d64b4b', sourceName: 'Group of the Progressive Alliance of Socialists and Democrats in the European Parliament' },
  { id: 'pfe', name: 'PfE', fullName: 'Patrioten für Europa', color: '#253b78', sourceName: 'Patriots for Europe Group' },
  { id: 'ecr', name: 'EKR', fullName: 'Europäische Konservative und Reformer', color: '#3972a8', sourceName: 'European Conservatives and Reformists Group' },
  { id: 'renew', name: 'Renew', fullName: 'Renew Europe', color: '#e6a426', sourceName: 'Renew Europe Group' },
  { id: 'greens', name: 'Grüne/EFA', fullName: 'Grüne / Freie Europäische Allianz', color: '#2f9468', sourceName: 'Group of the Greens/European Free Alliance' },
  { id: 'left', name: 'The Left', fullName: 'Die Linke im Europäischen Parlament', color: '#9b3a8f', sourceName: 'The Left group in the European Parliament - GUE/NGL' },
  { id: 'esn', name: 'ESN', fullName: 'Europa der Souveränen Nationen', color: '#5d5a88', sourceName: 'Europe of Sovereign Nations Group' },
]

function apiUrl(resource) {
  return `${API_BASE}/meetings/${MEETING_ID}/${resource}?vote-method=ROLL_CALL_EV&format=application%2Fld%2Bjson&json-layout=framed-and-included&offset=0&limit=1000`
}

function documentApiUrl(docId) {
  return `${API_BASE}/plenary-documents/${docId}?format=application%2Fld%2Bjson&json-layout=framed-and-included`
}

async function fetchJson(url) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`)
  return response.json()
}

function parseCsv(text) {
  const rows = []
  let row = []
  let field = ''
  let quoted = false
  for (let index = 0; index <= text.length; index += 1) {
    const character = text[index]
    if (character === '"') {
      if (quoted && text[index + 1] === '"') {
        field += '"'
        index += 1
      } else quoted = !quoted
    } else if ((character === ',' || character === '\n' || index === text.length) && !quoted) {
      row.push(field.replace(/\r$/, ''))
      field = ''
      if (character === '\n' || index === text.length) {
        if (row.some(Boolean)) rows.push(row)
        row = []
      }
    } else field += character || ''
  }
  const headers = rows.shift()
  return rows.map(values => Object.fromEntries(headers.map((header, index) => [header, values[index] || ''])))
}

function cleanTitle(value = '') {
  return value.replace(/\s*\*+I?\s*$/u, '').replace(/\s+/g, ' ').trim()
}

function classify(title) {
  if (/Jugend|Arbeitsleben|BAföG|Bildung/i.test(title)) return 'Arbeit & Gesellschaft'
  if (/CO2|Emissionshandel|Dekarbon|Klima|Umwelt/i.test(title)) return 'Klima & Wirtschaft'
  if (/Fischerei/i.test(title)) return 'Umwelt & Fischerei'
  if (/Haushalt|Euro|Banken/i.test(title)) return 'Finanzen'
  if (/Handel|Waren/i.test(title)) return 'Handel'
  if (/Demokratie|Schutzschild/i.test(title)) return 'Demokratie'
  return 'Europäische Politik'
}

function finalVoteScore(decision) {
  const label = decision.activity_label?.de || ''
  if (/gesamter Text/i.test(label)) return 100
  if (/Vorschlag der Kommission/i.test(label)) return 95
  if (/Vorläufige Einigung/i.test(label)) return 90
  if (/Entschließungsantrag/i.test(label)) return 85
  if (decision.decisionAboutId == null) return 60
  return 0
}

function documentId(parent) {
  return String(parent.based_on_a_realization_of?.[0] || '').split('/').pop()
}

function decisionKind(label) {
  if (/gesamter Text/i.test(label)) return 'Abstimmung über den gesamten Text'
  if (/Vorschlag der Kommission/i.test(label)) return 'Abstimmung über den Kommissionsvorschlag'
  if (/Vorläufige Einigung/i.test(label)) return 'Abstimmung über die vorläufige Einigung'
  if (/Entschließungsantrag/i.test(label)) return 'Abstimmung über den Entschließungsantrag'
  return 'Namentliche Schlussabstimmung'
}

function extractGermanDocument(document) {
  const work = document?.data?.[0]
  const expression = work?.is_realized_by?.find(item => item.language?.endsWith('/DEU') || item.id?.endsWith('/de'))
  return {
    title: expression?.title?.de || work?.title_dcterms?.de || work?.label?.de || '',
    description: expression?.title_alternative?.de || '',
  }
}

function tallyGroups(decision, groupByPerson) {
  const tallies = Object.fromEntries(groups.map(group => [group.id, { yes: 0, no: 0, abstain: 0 }]))
  const record = (people = [], position) => people.forEach(person => {
    const groupId = groupByPerson.get(String(person).split('/').pop())
    if (groupId) tallies[groupId][position] += 1
  })
  record(decision.had_voter_favor, 'yes')
  record(decision.had_voter_against, 'no')
  record(decision.had_voter_abstention, 'abstain')

  const positions = {}
  for (const group of groups) {
    const tally = tallies[group.id]
    const coverage = tally.yes + tally.no + tally.abstain
    const ordered = Object.entries(tally).sort((a, b) => b[1] - a[1])
    if (coverage >= 5 && ordered[0][1] > ordered[1][1]) positions[group.id] = ordered[0][0]
    tally.coverage = coverage
    tally.position = positions[group.id] || null
  }
  return { tallies, positions }
}

async function main() {
  const [voteResults, decisions, mepCsv] = await Promise.all([
    fetchJson(apiUrl('vote-results')),
    fetchJson(apiUrl('decisions')),
    fetch(MEP_CSV_URL).then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status} for ${MEP_CSV_URL}`)
      return response.text()
    }),
  ])

  const groupIdByName = new Map(groups.map(group => [group.sourceName, group.id]))
  const groupByPerson = new Map()
  for (const mep of parseCsv(mepCsv)) {
    // Multiple values mean the member changed group during the term. Without
    // membership dates in this CSV we exclude that person from group tallies.
    if (!mep.mep_political_group.includes(';')) {
      const groupId = groupIdByName.get(mep.mep_political_group)
      if (groupId) groupByPerson.set(mep.mep_identifier, groupId)
    }
  }

  const decisionsByParent = new Map()
  for (const decision of decisions.data || []) {
    for (const parentId of decision.inverse_consists_of || []) {
      if (!decisionsByParent.has(parentId)) decisionsByParent.set(parentId, [])
      decisionsByParent.get(parentId).push(decision)
    }
  }

  const selected = []
  for (const parent of voteResults.data || []) {
    const candidates = (decisionsByParent.get(parent.id) || [])
      .map(decision => ({ decision, score: finalVoteScore(decision) }))
      .filter(candidate => candidate.score > 0)
      .sort((a, b) => b.score - a.score || Number(b.decision.activity_order || 0) - Number(a.decision.activity_order || 0))
    if (candidates[0]) selected.push({ parent, decision: candidates[0].decision, score: candidates[0].score })
  }

  const chosen = selected
    .sort((a, b) => Number(a.decision.activity_order || 0) - Number(b.decision.activity_order || 0))
    .slice(0, 12)

  const documentIds = [...new Set(chosen.map(({ parent }) => documentId(parent)).filter(Boolean))]
  const documents = new Map(await Promise.all(documentIds.map(async docId => [
    docId,
    extractGermanDocument(await fetchJson(documentApiUrl(docId))),
  ])))

  const votes = chosen
    .map(({ parent, decision }) => {
      const title = cleanTitle(parent.activity_label?.de || decision.activity_label?.de)
      const officialDecision = cleanTitle(decision.activity_label?.de)
      const docId = documentId(parent)
      const document = documents.get(docId) || {}
      const documentUrl = docId ? `https://www.europarl.europa.eu/doceo/document/${docId}_DE.html` : null
      const { tallies, positions } = tallyGroups(decision, groupByPerson)
      return {
        id: decision.activity_id,
        parliament: 'eu',
        status: 'closed',
        date: decision.activity_date,
        topic: classify(title),
        title,
        short: `${decisionKind(officialDecision)} im Europäischen Parlament. Entscheide zuerst selbst; danach siehst du das amtliche Ergebnis.`,
        officialDecision,
        documentId: docId || null,
        documentTitle: cleanTitle(document.title || title),
        documentDescription: cleanTitle(document.description || ''),
        documentEmbedUrl: documentUrl,
        outcome: String(decision.decision_outcome || '').split('/').pop().toLowerCase(),
        result: {
          yes: Number(decision.number_of_votes_favor || 0),
          no: Number(decision.number_of_votes_against || 0),
          abstain: Number(decision.number_of_votes_abstention || 0),
        },
        positions,
        groupTallies: tallies,
        sources: [
          { label: 'Amtliche Abstimmungsdaten', url: apiUrl('decisions') },
          ...(documentUrl ? [{ label: `Parlamentsdokument ${docId}`, url: documentUrl }] : []),
        ],
      }
    })

  if (votes.length < 8) throw new Error(`Only ${votes.length} suitable final votes found`)

  const dataset = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    meetingId: MEETING_ID,
    meetingDate: votes[0]?.date || MEETING_ID.slice(-10),
    parliament: 'Europäisches Parlament',
    license: 'CC BY 4.0',
    source: {
      name: 'European Parliament Open Data Portal API v2',
      url: 'https://data.europarl.europa.eu/en/developer-corner/opendata-api',
      mepDataset: MEP_CSV_URL,
    },
    methodology: 'Pro Themenblock wird eine namentliche Schlussabstimmung ausgewählt. Fraktionspositionen sind die jeweilige Mehrheit der zugeordneten Einzelstimmen. Personen mit mehrdeutiger Fraktionshistorie im Quelldatensatz werden aus der Fraktionsaggregation ausgeschlossen.',
    groups: groups.map(({ sourceName, ...group }) => group),
    votes,
  }

  await mkdir(dirname(OUTPUT), { recursive: true })
  await writeFile(OUTPUT, `${JSON.stringify(dataset, null, 2)}\n`)
  console.log(`Wrote ${votes.length} official votes to ${OUTPUT}`)
  console.log(`Mapped ${groupByPerson.size} MEPs with unambiguous group membership`)
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
