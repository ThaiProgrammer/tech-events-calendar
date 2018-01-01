const ics = require('ics')
const peg = require('pegjs')
const fs = require('fs')

const grammar = fs.readFileSync('./grammar.pegjs', { encoding: 'utf8' })
const parser = peg.generate(grammar)

const content = fs.readFileSync('./README.md', { encoding: 'utf8' })
const eventsData = content.substring(0, content.indexOf('## Symbol Legend'))
const document = parser.parse(eventsData)

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

async function createIcs() {
  return Promise.all(
    document.events
      .map(event => {
        const header = event.header
        const content = event.content

        const year = parseInt(document.year, 10)
        const month = months.indexOf(document.month) + 1

        let start = [year, month, header.day.from, 0, 0]
        let end = []
        if (header.day.to) {
          end = [year, month, header.day.to, 0, 0]
        }
        if (content.time) {
          const firstTime = content.time[0]
          const lastTime = content.time[content.time.length - 1]
          start = [
            year,
            month,
            header.day.from,
            firstTime.from.hour,
            firstTime.from.minute
          ]
          end = [
            year,
            month,
            header.day.from,
            lastTime.to.hour,
            lastTime.to.minute
          ]
        }
        return {
          start,
          end,
          categories: [content.topic.type],
          title: header.title,
          location: content.location && content.location.location,
          description: content.th_summary + content.en_summary
        }
      })
      .map(item => {
        return new Promise((resolve, reject) => {
          ics.createEvent(item, (error, value) => {
            if (error) return reject(error)
            resolve([value, item])
          })
        })
      })
  )
}

createIcs().then(events => {
  fs.writeFileSync('events.json', JSON.stringify(events.map(event => event[1])))
  events.forEach(([ics, item]) => {
    fs.writeFileSync(`${item.title}.ics`, ics)
  })
})
