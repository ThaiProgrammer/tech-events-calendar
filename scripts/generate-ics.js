// Generates ICS file from `public/calendar.json`

const data = require('../public/calendar')
const icalendar = require('icalendar')

function generateICS () {
  const ical = new icalendar.iCalendar()
  for (const event of generateEvents()) {
    ical.addComponent(event)
  }
  return ical.toString()

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

  function generateEvents () {
    const result = []
    for (const event of data) {
      const genDate = new Date()
      const vEvent = new icalendar.VEvent(event.id)
      let start, end, startDate, endDate

      if (event.time != null) {
        const total = event.time.length
        startDate = new Date(event.start.year, event.start.month - 1, event.start.date)
        endDate = new Date(event.start.year, event.start.month - 1, event.start.date)
        startDate.setHours(event.time[0].from.hour)
        startDate.setMinutes(event.time[0].from.minute)
        endDate.setHours(event.time[total-1].to.hour)
        endDate.setMinutes(event.time[total-1].to.minute)
        vEvent.setDate(startDate, endDate)
      } else {
        // Full day support hacked from https://github.com/tritech/node-icalendar/pull/43
        startDate = new Date(event.start.year, event.start.month - 1, event.start.date)
        endDate = new Date(event.end.year, event.end.month - 1, event.end.date + 1)
        var startProperty = vEvent.addProperty('DTSTART', startDate)
        startProperty.setParameter('VALUE', 'DATE')
        startProperty.type = 'DATE'
        var endProperty = vEvent.addProperty('DTEND', endDate)
        endProperty.setParameter('VALUE', 'DATE')
        endProperty.type = 'DATE'
      }
      vEvent.setSummary(event.title)
      vEvent.setLocation(event.location.title)
      vEvent.addProperty('COMMENT', event.summary)
      // XXX: Maybe should link back to repo, for users to discover ALL links?
      vEvent.addProperty('URL', event.links[0].url)
      vEvent.setDescription(event.description)
      vEvent.addProperty('CATEGORIES', event.categories)
      vEvent.addProperty('TRANSP', 'OPAQUE')
      result.push(vEvent)
    }
    return result
  }
}

const ics = generateICS()
const path = `public/calendar.ics`
require('fs').writeFileSync(path, ics)
console.log('* Generated', path)
