/** @flow */
const fs = require('fs')
const parseReadme = require('../lib/parseReadme')

function main () {
  try {
    const rawContent = fs.readFileSync('./README.md', { encoding: 'utf8' })
    const json = parseReadme(rawContent, 'README.md')
    const path = 'public/calendar.json'
    fs.writeFileSync(path, JSON.stringify(json, null, 2))
    console.log('* Written calendar to', path)
  } catch (e) {
    if (!e.location) {
      throw e
    }
    require('child_process').execSync('mkdir -p tmp')
    const path = 'tmp/readme-parse-errors.json'
    fs.writeFileSync(path, JSON.stringify([{
      message: e.message,
      location: e.location
    }], null, 2))
    console.log('* Parse error written to', path)
    throw e
  }
}

main()
