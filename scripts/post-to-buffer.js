const axios = require('axios')
const querystring = require('qs')
const _ = require('lodash')
const admin = require('firebase-admin')
const cowsay = require('cowsay')
const wrapAnsi = require('wrap-ansi')
const Table = require('cli-table')

const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString(
    'utf8'
  )
)

const bufferAccessToken = process.env.BUFFER_ACCESS_TOKEN
if (!bufferAccessToken) throw new Error('Env BUFFER_ACCESS_TOKEN missing')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://tech-events-calendar-th.firebaseio.com'
})

process.on('unhandledRejection', up => {
  throw up
})

const MONTHS = 'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec'.split(',')
const DAYS = 'Sun,Mon,Tue,Wed,Thu,Fri,Sat'.split(',')

function dateOf({ year, month, date }) {
  return new Date(year, month - 1, date)
}

function dates(event) {
  const date = ({ year, month, date }) => {
    const day = dateOf({ year, month, date }).getDay()
    return `${MONTHS[month - 1]} ${date} (${DAYS[day]})`
  }
  const formatTime = t => `${t.hour}:${t.minute < 10 ? '0' : ''}${t.minute}`
  const start = date(event.start)
  const end = date(event.end)
  const time =
    event.time && event.time.length === 1
      ? `${formatTime(event.time[0].from)} ~ ${formatTime(event.time[0].to)}`
      : ''
  return `${start}${end !== start ? ` ~ ${end}` : ''}${time ? `, ${time}` : ''}`
}

function hashtags(tags) {
  return tags.map(x => `#${x.replace(/[^a-zA-Z0-9_]/g, '')}`).join(' ')
}

function say(text) {
  return cowsay.say({ text: wrapAnsi(text, 80, { hard: true }) })
}

async function post(event, postMode) {
  if (!event) {
    throw new Error('Must supply event')
  }

  const url = `https://calendar.thaiprogrammer.org/event/${event.id}`
  const fbEventLink = event.links.filter(link =>
    /https:\/\/(?:www|web)\.facebook\.com\/events\/\d+/.test(link.url)
  )[0]
  const fbEventUrl = fbEventLink && fbEventLink.url
  const link = fbEventUrl || url
  const location = event.location && event.location.title
  const text = [
    `[Event] ${event.title}`,
    `${dates(event)}${location ? ` @ ${location}` : ''}`,
    '',
    `${event.summary}`,
    `${hashtags([...event.categories, ...event.topics])}`,
    ...(fbEventUrl ? ['', url] : [])
  ].join('\n')
  console.log('Text to be posted:')
  console.log(say(`${text}\n\n${link}`))
  console.log()

  // Uncomment the next line for dry-run!
  // return

  const postData = querystring.stringify({
    text,
    profile_ids: ['5abf3ce205fbf6386e4cebc8'],
    media: { link },
    shorten: 'false',
    access_token: bufferAccessToken
  })
  console.log('Post data:')
  console.log(say(postData))

  console.log('Setting status to POSTING...')
  await admin
    .database()
    .ref(`buffer/events/${event.id}/status`)
    .set('POSTING')
  console.log('Posting...')
  await axios.post('https://api.bufferapp.com/1/updates/create.json', postData)
  console.log('Setting status to POSTED...')
  await admin
    .database()
    .ref(`buffer/events/${event.id}/status`)
    .set('POSTED')
  console.log('Writing log...')
  await admin
    .database()
    .ref(`buffer/logs`)
    .push({
      type: 'POST',
      postMode,
      date: new Date(),
      eventId: event.id
    })
}

function checkPostingCriteria(event, bufferData) {
  const status = _.get(bufferData, ['events', event.id, 'status'])
  if (!status) {
    return { postMode: 'NEW', result: 'NEW EVENT' }
  }
  return { result: status }
}

async function main() {
  try {
    const response = await axios.get(
      'https://thaiprogrammer-tech-events-calendar.spacet.me/calendar.json'
    )
    const bufferData = (await admin
      .database()
      .ref('buffer')
      .once('value')).val()
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const upcomingEvents = response.data.filter(e => dateOf(e.start) >= today)

    const table = new Table({
      head: ['event id', 'post', 'result']
    })
    const results = upcomingEvents.map(e => {
      const { postMode, result } = checkPostingCriteria(e, bufferData)
      return { postMode, result, event: e }
    })
    table.push(
      ...results.map(({ postMode, result, event }) => [
        event.id,
        postMode || '---',
        result
      ])
    )
    console.log(table.toString())

    for (const { postMode, event } of results) {
      if (postMode) await post(event, postMode)
    }
  } catch (e) {
    if (e.response) {
      console.error('Received response:', e.response.data)
    }
    process.exitCode = 1
    console.error(e.stack)
    throw e
  } finally {
    process.exit(process.exitCode || 0)
  }
}

main()
