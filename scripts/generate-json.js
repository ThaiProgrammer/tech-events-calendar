/** @flow */
const fs = require('fs')
const parseReadme = require('../lib/parseReadme')

function main () {
  const diagnostic = { errors: [ ] }
  try {
    const rawContent = fs.readFileSync('./README.md', { encoding: 'utf8' })
    const json = parseReadme(rawContent, 'README.md')
    validateJson(json)
    const path = 'public/calendar.json'
    fs.writeFileSync(path, JSON.stringify(json, null, 2))
    console.log('* Written calendar to', path)
  } catch (e) {
    if (!e.location) {
      throw e
    }
    diagnostic.errors.push({
      message: e.message,
      location: e.location
    })
    throw e
  } finally {
    require('child_process').execSync('mkdir -p tmp')
    const path = 'tmp/readme-parse-diagnostic.json'
    fs.writeFileSync(path, JSON.stringify(diagnostic, null, 2))
    console.log('* Diagnostic information written to', path)
  }
}

function validateJson (json) {
  const usedIds = { }
  for (const event of json) {
    if (usedIds[event.id]) {
      const error/*: any*/ = new Error(
        'Validation error at ' + formatLocation(event.declared) + ': ' +
        'Duplicate event ID "' + event.id + '" ' +
        '(previously declared at ' + formatLocation(usedIds[event.id].declared) + ')'
      )
      error.location = event.declared
      throw error
    }
    usedIds[event.id] = event
  }
}

function formatLocation (location) {
  return `${location.filename}, line ${location.line}, column ${location.column}`
}

main()
