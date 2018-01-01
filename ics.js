const peg = require('pegjs')
const fs = require('fs')

const grammar = fs.readFileSync('./grammar.pegjs', { encoding: 'utf8' })
const parser = peg.generate(grammar)

const content = fs.readFileSync('./README.md', { encoding: 'utf8' })
const eventsData = content.substring(0, content.indexOf('## Symbol Legend'))
const events = parser.parse(eventsData)
console.log(events)
