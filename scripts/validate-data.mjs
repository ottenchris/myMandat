import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const file = resolve('dist/data/ep-votes.json')
const dataset = JSON.parse(await readFile(file, 'utf8'))

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

assert(dataset.schemaVersion === 1, 'Unsupported dataset schema')
assert(dataset.parliament === 'Europäisches Parlament', 'Unexpected parliament')
assert(Array.isArray(dataset.groups) && dataset.groups.length === 8, 'Expected eight political groups')
assert(Array.isArray(dataset.votes) && dataset.votes.length >= 8, 'Expected at least eight votes')

const groupIds = new Set(dataset.groups.map(group => group.id))
assert(groupIds.size === dataset.groups.length, 'Duplicate group IDs')

for (const vote of dataset.votes) {
  assert(vote.id && vote.date && vote.title && vote.officialDecision, `Incomplete vote ${vote.id || '(missing id)'}`)
  assert(vote.documentTitle && vote.documentDescription && vote.documentEmbedUrl, `Missing German document metadata for ${vote.id}`)
  assert(vote.result.yes + vote.result.no + vote.result.abstain > 0, `Empty result for ${vote.id}`)
  assert(Array.isArray(vote.sources) && vote.sources.length > 0, `Missing sources for ${vote.id}`)
  assert(Object.keys(vote.positions).length >= 6, `Too few group positions for ${vote.id}`)
  for (const groupId of Object.keys(vote.positions)) assert(groupIds.has(groupId), `Unknown group ${groupId}`)
}

console.log(`Validated ${dataset.votes.length} votes and ${dataset.groups.length} groups from ${dataset.meetingId}.`)
