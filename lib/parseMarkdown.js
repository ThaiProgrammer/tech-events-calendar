/* This file uses a lot of imperative logic, so continues are allowed. */
/* eslint no-continue: off */
const frontMatter = require('front-matter')

module.exports = function parseMarkdown(md, options) {
  const { body, attributes } = frontMatter(md)
  const event = {}
  const checks = []
  let active = null
  const item = (title, f) => {
    const parent = active
    const current = { type: 'item', title, children: [] }
    active = current
    try {
      if (parent) {
        parent.children.push(current)
      } else {
        checks.push(current)
      }
      return f()
    } finally {
      active = parent
    }
  }
  const check = (title, result) => {
    if (!active) {
      throw new Error('Invalid state - a check must be in an item')
    }
    const checkObject = { type: 'check', title, result }
    active.children.push(checkObject)
    return result
  }
  const ok = value => ({
    success: true,
    condition(title, f) {
      const status = f(value)
      if (status === true) {
        check(title, { status: true })
        return this
      } else if (status === false) {
        check(title, { status: false })
        return notOk()
      } else if (typeof status === 'string') {
        check(title, { status: false, message: status })
        return notOk()
      }
      throw new Error(
        `Invalid return value — expected true, false or string message. ${status} received.`
      )
    },
    conditions(cnds) {
      const results = cnds.map(([title, f]) => this.condition(title, f))
      return results.every(r => r.success) ? this : notOk()
    },
    map(f) {
      return ok(f(value))
    },
    flatMap(f) {
      return f(value)
    },
    ok(f) {
      f(value)
      return this
    }
  })
  const notOk = () => ({
    success: false,
    condition(title, f) {
      void f
      check(title, { result: null })
      return this
    },
    conditions(cs) {
      for (const [title] of cs) check(title, { result: null })
      return this
    },
    map() {
      return this
    },
    flatMap() {
      return this
    },
    ok() {
      return this
    }
  })
  const element = x => ok(x)
  const combine = elements =>
    elements.reduce(
      (r, el) => r.flatMap(a => el.map(v => [...a, v])),
      element([])
    )
  processData({ body, attributes }, event, { item, element, combine }, options)
  return { event, checks }
}

function processData(
  { body, attributes },
  eventObject,
  { item, element, combine },
  options
) {
  const event = eventObject

  // id
  item('`id`', () => {
    element(attributes.id)
      .condition('is present', x => !!x)
      .condition('is a string', x => typeof x === 'string')
      .condition('contains only lowercase characters, numbers, or hyphens', x =>
        /^[a-z0-9-]+$/.test(x)
      )
      .ok(x => {
        event.id = x
      })
  })

  // start, end
  item('`date`', () => {
    const parsedDate = element(attributes.date)
      .condition('is present', x => !!x)
      .condition('is a string', x => typeof x === 'string')
      .map(x =>
        x.match(/^(\d\d\d\d)-(\d\d)-(\d\d)(?: ~ (\d\d\d\d)-(\d\d)-(\d\d))?$/)
      )
      .condition(
        'is in form of "YYYY-MM-DD" or "YYYY-MM-DD ~ YYYY-MM-DD"',
        m => !!m
      )
      .map(m => ({
        start: { year: +m[1], month: +m[2], date: +m[3] },
        end: {
          year: +m[4] || +m[1],
          month: +m[5] || +m[2],
          date: +m[6] || +m[3]
        }
      }))
    const startDateValid = ['start date is valid', ds => dateValid(ds.start)]
    const endDateValid = ['end date is valid', ds => dateValid(ds.end)]
    parsedDate
      .conditions([startDateValid, endDateValid])
      .conditions([
        ...(options.expectedYear
          ? [
              [
                `start year is ${options.expectedYear}`,
                ds => ds.start.year === options.expectedYear
              ]
            ]
          : []),
        ...(options.expectedMonth
          ? [
              [
                `start month is ${options.expectedMonth}`,
                ds => ds.start.month === options.expectedMonth
              ]
            ]
          : [])
      ])
      .ok(ds => {
        event.start = ds.start
        event.end = ds.end
      })
    function dateValid(d) {
      const date = new Date(d.year, d.month - 1, d.date)
      return (
        date.getFullYear() === d.year &&
        date.getMonth() === d.month - 1 &&
        date.getDate() === d.date
      )
    }
  })

  // categories
  item('`categories`', () => {
    element(attributes.categories)
      .condition('is present', x => !!x)
      .condition('is an array', x => Array.isArray(x))
      .flatMap(a =>
        element(a).conditions(
          a.map((v, i) => [`item ${i} is valid`, () => categoryValid(v)])
        )
      )
      .ok(a => {
        event.categories = a
      })
    function categoryValid(v) {
      if (typeof v !== 'string') return 'not a string'
      if (!v) return 'category is empty'
      const ALLOWED_CATEGORIES = [
        'Codefest',
        'Conference',
        'Hackathon',
        'Meetup',
        'Seminar',
        'Workshop'
      ]
      if (!ALLOWED_CATEGORIES.includes(v))
        return `category is not valid; allowed categories are: ${ALLOWED_CATEGORIES.join(
          ', '
        )}`
      return true
    }
  })

  // topics
  item('`topics`', () => {
    element(attributes.topics)
      .condition('is present', x => !!x)
      .condition('is an array', x => Array.isArray(x))
      .flatMap(a =>
        element(a).conditions(
          a.map((v, i) => [`item ${i} is valid`, () => topicValid(v)])
        )
      )
      .ok(a => {
        event.topics = a
      })
    function topicValid(v) {
      if (typeof v !== 'string') return 'not a string'
      if (!v) return 'topic is empty'
      return true
    }
  })

  // `time`
  item('`time`', () => {
    if (!attributes.time) {
      return element()
        .condition('no time (all-day event)', () => true)
        .ok(() => {
          event.time = null
        })
    }
    if (typeof attributes.time === 'string') {
      return checkValidTime(attributes.time).ok(t => {
        event.time = [t]
      })
    }
    if (Array.isArray(attributes.time)) {
      return element(attributes.time)
        .condition('is an array of time strings', () => true)
        .flatMap(a =>
          combine(a.map((t, i) => item(`item ${i}`, () => checkValidTime(t))))
        )
        .ok(ts => {
          event.time = ts
        })
    }
    return element().condition(
      'is not present (all-day event), a single string, or an array of strings',
      () => false
    )
    function checkValidTime(timeString) {
      return element(timeString)
        .condition('is a string', x => typeof x === 'string')
        .map(s => s.match(/^(\d+):(\d\d) ~ (\d+):(\d\d)(\+\+)?(?: \((.+)\))?$/))
        .condition('is in form "HH:MM ~ HH:MM[++][ (agenda)]"', m => !!m)
        .map(m => ({
          from: { hour: +m[1], minute: +m[2] },
          to: { hour: +m[3], minute: +m[4] },
          after: !!m[5],
          agenda: m[6] || null
        }))
        .conditions([
          ['start time is valid', t => validTime(t.from)],
          ['end time is valid', t => validTime(t.to)]
        ])
    }
    function validTime(ti) {
      return ti.hour >= 0 && ti.hour <= 24 && ti.minute >= 0 && ti.minute < 60
    }
  })

  const markdownBody = parseMarkdownBody(body)
  function validMarkdownBody(b) {
    if (b.error) {
      return `failed to read markdown body: ${b.error}`
    }
    return true
  }

  item('**title** (in markdown body)', () => {
    element(markdownBody)
      .condition('markdown body is valid', validMarkdownBody)
      .map(b => b.title)
      .condition('title is present', t => !!t)
      .ok(t => {
        event.title = t
      })
  })

  item('`location`', () => {
    element(attributes.location)
      .condition('is present', l => !!l)
      .conditions([
        ['`title` is a string', l => l && typeof l.title === 'string'],
        [
          '`url` is an optional Google Maps URL',
          l => {
            const { url } = l
            if (!url) {
              return true
            }
            if (!/^https:\/\/www\.google\.com\/maps\/place\//.test(url)) {
              return 'not a Google Maps URL (should start with `https://www.google.com/maps/place`)'
            }
            return true
          }
        ],
        [
          '`detail` is an optional string',
          l => !l.detail || typeof l.detail === 'string'
        ]
      ])
      .ok(l => {
        event.location = l
      })
  })

  item('**summary** (in markdown body)', () => {
    element(markdownBody)
      .condition('summary', validMarkdownBody)
      .map(b => b.summary)
      .ok(s => {
        event.summary = s
      })
  })

  item('**description** (in markdown body)', () => {
    element(markdownBody)
      .condition('description', validMarkdownBody)
      .map(b => b.description)
      .ok(s => {
        event.description = s
      })
  })

  item('`links`', () => {
    element(attributes.links)
      .condition('is an array', x => Array.isArray(x))
      .condition('is not empty', x => x.length > 0)
      .flatMap(a =>
        combine(a.map((v, i) => item(`item ${i}`, () => checkValidLink(v))))
      )
      .ok(links => {
        event.links = links
      })
    function checkValidLink(v) {
      const VALID_LINK_TYPES = ['website', 'ticket', 'rsvp']
      return element(v).conditions([
        [
          '`type` is valid',
          () => {
            if (!VALID_LINK_TYPES.includes(v.type)) {
              return `type is not valid; allowed types are: ${VALID_LINK_TYPES.join(
                ', '
              )}`
            }
            return true
          }
        ],
        ['`url` is a string', () => typeof v.url === 'string'],
        ['`url` is an http(s) url', () => /^https?:\/\//.test(v.url)],
        [
          '`detail` is an optional string',
          () => !v.detail || typeof v.detail === 'string'
        ],
        [
          '`price` is an optional string (only present in ticket)',
          () => {
            if (v.type !== 'ticket') {
              if (v.price) {
                return '`price` field is only valid on ticket link'
              }
              return true
            }
            return !v.price || typeof v.price === 'string'
          }
        ]
      ])
    }
  })

  item('`resources`', () => {
    if (!attributes.resources) {
      element()
        .condition('no official resources', () => true)
        .ok(() => {
          event.resources = []
        })
      return
    }
    element(attributes.resources)
      .condition('is an array', x => Array.isArray(x))
      .flatMap(a =>
        combine(a.map((v, i) => item(`item ${i}`, () => checkValidResource(v))))
      )
      .ok(resources => {
        event.resources = resources
      })
  })

  item('`community_resources`', () => {
    if (!attributes.community_resources) {
      element()
        .condition('no community resources', () => true)
        .ok(() => {
          event.communityResources = []
        })
      return
    }
    element(attributes.community_resources)
      .condition('is an optional array', x => !x || Array.isArray(x))
      .flatMap(a =>
        combine(a.map((v, i) => item(`item ${i}`, () => checkValidResource(v))))
      )
      .ok(communityResources => {
        event.communityResources = communityResources
      })
  })

  function checkValidResource(v) {
    const VALID_RESOURCE_TYPES = ['video', 'code', 'photo', 'writeup', 'slides']
    return element(v).conditions([
      [
        '`type` is valid',
        () => {
          if (!VALID_RESOURCE_TYPES.includes(v.type)) {
            return `type is not valid; allowed types are: ${VALID_RESOURCE_TYPES.join(
              ', '
            )}`
          }
          return true
        }
      ],
      ['`url` is a string', () => typeof v.url === 'string'],
      ['`url` is an http(s) url', () => /^https?:\/\//.test(v.url)],
      [
        '`detail` is an optional string',
        () => !v.detail || typeof v.detail === 'string'
      ]
    ])
  }
}

function parseMarkdownBody(body) {
  const lines = body.split(/\r\n|\r|\n/)
  let state = 'title'
  let title
  let error
  const summary = []
  const description = []
  for (const line of lines) {
    if (state === 'title') {
      if (/^\s*$/.test(line)) {
        continue
      }
      const m = line.match(/^# (.+)$/)
      if (!m) {
        error = 'Title expected (# Event title here).'
        break
      }
      // eslint-disable-next-line prefer-destructuring
      title = m[1]
      state = 'summary'
      continue
    }
    if (state === 'summary') {
      if (/^\s*$/.test(line)) {
        if (summary.length) summary.push('')
        continue
      }
      const m = line.match(/^> (.+)$/)
      if (!m) {
        description.push(line)
        state = 'description'
        continue
      }
      summary.push(m[1])
      continue
    }
    if (state === 'description') {
      description.push(line)
      continue
    }
    throw new Error(`Invalid state: ${state}`)
  }
  return {
    title,
    summary: summary.join('\n').trim(),
    description: description.join('\n').trimRight(),
    error
  }
}
