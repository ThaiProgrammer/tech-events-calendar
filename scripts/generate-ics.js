// Generates ICS file from `public/calendar.json`

const data = require('../public/calendar')

function generateICS () {
  const ics = [
    `BEGIN:VCALENDAR`,
    `VERSION:2.0`,
    `PRODID:-//Thai Programmer//NONSGML v1.0//EN`,
    `CALSCALE:GREGORIAN`,
    `METHOD:PUBLISH`,
    `${renderCells()}`,
    `END:VCALENDAR`
  ].join('\n')
  return ics

  function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1)
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4()
  }

  function pad(number) {
    if (number < 10) {
      return '0' + number
    }
    return number
  }

  function toISOString (date) {
    return date.getUTCFullYear() +
      pad(date.getUTCMonth() + 1) +
      pad(date.getUTCDate()) + 'T' + 
      pad(date.getUTCHours()) +
      pad(date.getUTCMinutes()) +
      pad(date.getUTCSeconds()) + 'Z'
  }

  function toISODateString (date) {
    return date.getUTCFullYear() +
      pad(date.getUTCMonth() + 1) +
      pad(date.getUTCDate() + 1)
  }

  function addNewlines(str,octets = 30) {
    var result = ''
    while (str.length > 0) {
      result += str.substring(0, octets).trim() + '\r\n '
      str = str.substring(octets)
    }
    return result
  }

  function renderCells () {
    const result = []
    for (const event of data) {
      const genDate = new Date()
      let start, end, startDate, endDate

      if (event.time != null) {
        const total = event.time.length
        startDate = new Date(event.start.year, event.start.month - 1, event.start.date)
        endDate = new Date(event.start.year, event.start.month - 1, event.start.date)
        startDate.setHours(event.time[0].from.hour)
        startDate.setMinutes(event.time[0].from.minute)
        endDate.setHours(event.time[total-1].to.hour)
        endDate.setMinutes(event.time[total-1].to.minute)
        start = `DTSTART:${toISOString(startDate)}`
        end = `DTEND:${toISOString(endDate)}`
      } else {
        startDate = new Date(event.start.year, event.start.month - 1, event.start.date)
        endDate = new Date(event.end.year, event.end.month - 1, event.end.date + 1)
        start = `DTSTART;VALUE=DATE:${toISODateString(startDate)}`
        end = `DTEND;VALUE=DATE:${toISODateString(endDate)}`
      }

      const description = addNewlines(event.description.replace(/(?:\n)/g, '\\n')).trim()
      
      result.push([
        `BEGIN:VEVENT\r`,
        `UID:${guid()}`,
        `DTSTAMP:${toISOString(genDate)}`,
        `${start}`,
        `${end}`,
        `CREATED:${toISOString(genDate)}`,
        `SUMMARY:${event.title}`,
        `LOCATION:${event.location.title}`,
        `DESCRIPTION:${description}`,
        `URL:${event.links[0].url}`,
        `SEQUENCE:0`,
        `TRANSP:OPAQUE`,
        `CATEGORIES:${event.categories.join(',')}`,
        `END:VEVENT`
      ].join('\n'))
    }
    return result.join('\n')
  }
}

const ics = generateICS()
const path = `public/calendar.ics`
require('fs').writeFileSync(path, ics)
console.log('* Generated', path)
