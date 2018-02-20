const frontMatter = require('front-matter')

module.exports = function parseMarkdown (md) {
  const { body, attributes } = frontMatter(md)
  const event = { }
  const checks = [ ]
  let active = null
  const item = (title, f) => {
    const parent = active
    const current = { type: 'item', title, children: [ ] }
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
    const check = { type: 'check', title, result }
    active.children.push(check)
    return result
  }
  const ok = (value) => {
    return {
      ok: true,
      condition (title, f) {
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
        } else {
          throw new Error('Invalid return value — expected true, false or string message. ' + status + ' received.')
        }
      },
      conditions (cnds) {
        const results = cnds.map(([ title, f ]) => this.condition(title, f))
        return results.every(r => r.ok) ? this : notOk()
      },
      map (f) {
        return ok(f(value))
      },
      flatMap (f) {
        return f(value)
      },
      ok (f) {
        f(value)
        return this
      }
    }
  }
  const notOk = () => {
    return {
      ok: false,
      condition (title, f) {
        check(title, { result: null })
        return this
      },
      conditions ([ cs ]) {
        for (const [ title, f ] of cs) check(title, { result: null })
        return this
      },
      map () {
        return this
      },
      flatMap () {
        return this
      },
      ok () {
        return this
      }
    }
  }
  const element = (x) => {
    return ok(x)
  }
  const combine = (elements) => {
    return elements.reduce(
      (r, el) => r.flatMap(a => el.map(v => [ ...a, v ])),
      element([ ])
    )
  }
  processData({ body, attributes }, event, { item, element, combine })
  return { event, checks }
}

function processData ({ body, attributes }, event, { item, element, combine }) {
  // id
  item('`id`', () => {
    element(attributes.id)
      .condition('is present', x => !!x)
      .condition('is a string', x => typeof x === 'string')
      .ok(x => {
        event.id = x
      })
  })

  // start, end
  item('`date`', () => {
    const parsedDate = element(attributes.date)
      .condition('is present', x => !!x)
      .condition('is a string', x => typeof x === 'string')
      .map(x => x.match(/^(\d\d\d\d)-(\d\d)-(\d\d)(?: ~ (\d\d\d\d)-(\d\d)-(\d\d))?$/))
      .condition('is in form of "YYYY-MM-DD" or "YYYY-MM-DD ~ YYYY-MM-DD"', m => !!m)
      .map(m => {
        return {
          start: { year: +m[1], month: +m[2], date: +m[3] },
          end: { year: +m[4] || +m[1], month: +m[5] || +m[2], date: +m[6] || +m[3] }
        }
      })
    const startDateValid = [ 'start date is valid', ds => dateValid(ds.start) ]
    const endDateValid = [ 'end date is valid', ds => dateValid(ds.end) ]
    parsedDate
      .conditions([ startDateValid, endDateValid ])
      .ok(ds => {
        event.start = ds.start
        event.end = ds.end
      })
    function dateValid (d) {
      const date = new Date(d.year, d.month - 1, d.date)
      return date.getFullYear() === d.year &&
        date.getMonth() === d.month - 1 &&
        date.getDate() === d.date
    }
  })

  // categories
  item('`categories`', () => {
    element(attributes.categories)
      .condition('is present', x => !!x)
      .condition('is an array', x => Array.isArray(x))
      .flatMap(a => element(a).conditions(
        a.map((v, i) => [ `item ${i} is valid`, () => categoryValid(v) ])
      ))
      .ok(a => {
        event.categories = a
      })
    function categoryValid (v) {
      if (typeof v !== 'string') return 'not a string'
      if (!v) return 'category is empty'
      const ALLOWED_CATEGORIES = [
        'Codefest',
        'Conference',
        'Hackathon',
        'Meetup',
        'Workshop',
      ]
      if (!ALLOWED_CATEGORIES.includes(v)) return `category is not valid; allowed categories are: ${ALLOWED_CATEGORIES.join(', ')}`
      return true
    }
  })

  // topics
  item('`topics`', () => {
    element(attributes.topics)
      .condition('is present', x => !!x)
      .condition('is an array', x => Array.isArray(x))
      .flatMap(a => element(a).conditions(
        a.map((v, i) => [ `item ${i} is valid`, () => topicValid(v) ])
      ))
      .ok(a => {
        event.topics = a
      })
    function topicValid (v) {
      if (typeof v !== 'string') return 'not a string'
      if (!v) return 'topic is empty'
      return true
    }
  })

  // `time`
  item('time', () => {
    if (!attributes.time) {
      return element()
        .condition('no time (all-day event)', () => true)
        .ok(() => {
          event.time = null
        })
    }
    if (typeof attributes.time === 'string') {
      return checkValidTime(attributes.time)
        .ok(t => {
          event.time = [ t ]
        })
    }
    if (Array.isArray(attributes.time)) {
      return element(attributes.time)
        .condition('is an array of time strings', () => true)
        .flatMap(a => combine(
          a.map((t, i) => item(`item ${i}`, () => checkValidTime(t)))
        ))
        .ok(ts => {
          event.time = ts
        })
    }
    return element()
      .condition('is not present (all-day event), a single string, or an array of strings', () => false)
    function checkValidTime (t) {
      return element(t)
        .condition('is a string', x => typeof x === 'string')
        .map(s => s.match(/^(\d+):(\d\d) ~ (\d+):(\d\d)(\+\+)?(?: \((.+)\))?$/))
        .condition('is in form "HH:MM ~ HH:MM[++][ (agenda)]"', m => !!m)
        .map(m => {
          return {
            from: { hour: +m[1], minute: +m[2] },
            to: { hour: +m[3], minute: +m[4] },
            after: !!m[5],
            agenda: m[6] || null
          }
        })
        .conditions([
          [ 'start time is valid', (t) => validTime(t.from) ],
          [ 'end time is valid', (t) => validTime(t.to) ]
        ])
    }
    function validTime (ti) {
      return ti.hour >= 0 && ti.hour <= 24 &&
        ti.minute >= 0 && ti.minute < 60
    }
  })

  const markdownBody = parseMarkdownBody(body)
  function validMarkdownBody (markdownBody) {
    if (markdownBody.error) {
      return `failed to read markdown body: ${markdownBody.error}`
    }
    return true
  }

  item('title', () => {
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
        [ '`title` is a string', (l) => {
          return l && (typeof l.title === 'string')
        } ],
        [ '`url` is an optional Google Maps URL', (l) => {
          const url = l.url
          if (!url) {
            return true
          }
          if (!/^https:\/\/www\.google\.com\/maps\/place\//.test(url)) {
            return 'not a Google Maps URL (should start with `https://www.google.com/maps/place`)'
          }
          return true
        } ],
        [ '`detail` is an optional string', (l) => {
          return !l.detail || (typeof l.detail === 'string')
        } ]
      ])
      .ok(l => {
        event.location = l
      })
  })

  item('summary', () => {
    element(markdownBody)
      .condition('summary', validMarkdownBody)
      .map(b => b.summary)
      .ok(s => {
        event.summary = s
      })
  })

  item('description', () => {
    element(markdownBody)
      .condition('description', validMarkdownBody)
      .map(b => b.description)
      .ok(s => {
        event.summary = s
      })
  })

  item('links', () => {
    element(attributes.links)
      .condition('is an array', x => Array.isArray(x))
      .flatMap(a => combine(a.map(
        (v, i) => item(`item ${i}`, () => checkValidLink(v)),
      )))
      .ok(links => {
        event.links = links
      })
    function checkValidLink (v) {
      const VALID_LINK_TYPES = [
        'website',
        'ticket',
        'rsvp'
      ]
      return element(v)
        .condition('`type` is valid', () => {
          if (!VALID_LINK_TYPES.includes(v.type)) {
            return 'type is not valid; allowed types are: ' + VALID_LINK_TYPES.join(', ')
          }
          return true
        })
        .condition('`url` is a string', () => typeof v.url === 'string')
        .condition('`url` is an http(s) url', () => /^https?:\/\//.test(v.url))
        .condition('`detail` is an optional string', () => !v.detail || (typeof v.detail === 'string'))
        .condition('`price` is an optional string (only present in ticket)', () => {
          if (v.type !== 'ticket') {
            if (v.price) {
              return '`price` field is only valid on ticket link'
            }
            return true
          }
          return !v.price || (typeof v.price === 'string')
        })
    }
  })
}

function parseMarkdownBody (body) {
  const lines = body.split(/\r\n|\r|\n/)
  let state = 'title'
  let title
  let error
  const summary = [ ]
  const description = [ ]
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
    throw new Error('Invalid state: ' + state)
  }
  return {
    title: title,
    summary: summary.join('\n').trim(),
    description: description.join('\n').trimRight(),
    error: error
  }
}
