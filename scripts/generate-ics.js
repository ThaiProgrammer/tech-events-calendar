// Generates ICS file from `public/calendar.json`

const data = require('../public/calendar')
const icalendar = require('icalendar')

function generateICS () {
  const ical = new icalendar.iCalendar()
  for (const event of generateEvents()) {
    ical.addComponent(event)
  }
  return ical.toString()

  function generateEvents () {
    const result = []
    for (const event of data) {
      const genDate = new Date()
      const vEvent = new icalendar.VEvent(`${event.id}@thaiprogrammer-calendar`)
      let start, end, startDate, endDate

      if (event.time != null) {
        const total = event.time.length
        startDate = new Date(Date.UTC(
          event.start.year,
          event.start.month - 1,
          event.start.date,
          event.time[0].from.hour - 7,
          event.time[0].from.minute
        ))
        endDate = new Date(Date.UTC(
          event.start.year,
          event.start.month - 1,
          event.start.date,
          event.time[total - 1].to.hour - 7,
          event.time[total - 1].to.minute
        ))
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
      const url = 'https://github.com/ThaiProgrammer/tech-events-calendar#' + event.id
      vEvent.addProperty('URL', url)
      vEvent.setDescription(event.summary + '\n\n' + event.description + '\n\n' + url)
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
