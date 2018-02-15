// Convert to JSON

const data = require('../public/calendar')
const yaml = require('js-yaml')
const path = require('path')
const mkdirp = require('mkdirp')
const fs = require('fs')

for (const event of data) {
  const md = dumpEvent(event)
  const targetPath = `data/${event.start.year}-${String(event.start.month).padStart(2, '0')}/${event.id}.md`
  mkdirp.sync(path.dirname(targetPath))
  fs.writeFileSync(targetPath, md)
  console.log(targetPath)
}

function dumpEvent (event) {
  const attributes = {
    id: event.id,
    title: event.title,
    date: dumpDate(event),
  }
  if (event.time) {
    attributes.time = event.time.length === 1 ? dumpTime(event.time[0]) : event.time.map(dumpTime)
  }
  if (event.location) {
    attributes.location = event.location
  }
  Object.assign(attributes, {
    categories: event.categories,
    topics: event.topics,
    links: event.links.map(dumpLink)
  })
  if (event.summary) {
    Object.assign(attributes, {
      summary: event.summary
    })
  }
  return '---\n' + yaml.safeDump(attributes) + '---\n' + event.description + '\n'
}

function dumpDate (event) {
  const format = (d) => {
    return `${d.year}-${String(d.month).padStart(2, '0')}-${String(d.date).padStart(2, '0')}`
  }
  const start = format(event.start)
  const end = format(event.end)
  return start + (start === end ? '' : ' ~ ' + end)
}

function dumpTime (time) {
  const format = (t) => {
    return String(t.hour).padStart(2, '0') + ':' + String(t.minute).padStart(2, '0')
  }
  const start = format(time.from)
  const end = format(time.to)
  return start + ' ~ ' + end + (time.after ? '++' : '') + (time.agenda ? ` (${time.agenda})` : '')
}

function dumpLink (link) {
  const out = {
    type: link.type
  }
  if (link.url) out.url = link.url
  if (link.title) out.title = link.title
  if (link.detail) out.detail = link.detail
  return out
}
