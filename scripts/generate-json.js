/** @flow */
const fs = require('fs')
const parseReadme = require('../lib/parseReadme')

function main () {
  const rawContent = fs.readFileSync('./README.md', { encoding: 'utf8' })
  const json = parseReadme(rawContent, 'README.md')
  const path = 'public/calendar.json'
  fs.writeFileSync(path, JSON.stringify(json, null, 2))
  console.log('* Written calendar to', path)
}

main()
