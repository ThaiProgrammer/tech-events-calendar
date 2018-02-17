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
      condition (title, f) {
        const result = f(value)
        if (result === true) {
          check(title, { result: true })
          return this
        } else if (result === false) {
          check(title, { result: false })
          return notOk()
        } else if (typeof result === 'string') {
          check(title, { result: false, message: result })
          return notOk()
        } else {
          throw new Error('Invalid return value — expected true, false or string message. ' + result + ' received.')
        }
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
      condition (title, f) {
        check(title, { result: null })
        return notOk()
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
  processData({ body, attributes }, event, { item, element })
  return { event, checks }
}

function processData ({ body, attributes }, event, { item, element }) {
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
    element(attributes.date)
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
      .condition('start date is valid', ds => dateValid(ds.start))
      .condition('end date is valid', ds => dateValid(ds.end))
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
      .flatMap(a => a.reduce(
        (c, v, i) => c.condition(
          `item ${i} is valid`,
          () => categoryValid(v)
        ),
        element(a)
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
      .flatMap(a => a.reduce(
        (c, v, i) => c.condition(
          `item ${i} is valid`,
          () => topicValid(v)
        ),
        element(a)
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
        .flatMap(a => {
          return a.reduce(
            (c, t, i) => item(
              `item ${i}`,
              () => checkValidTime(t).flatMap(t => c.map(ts => [ ...ts, t ]))
            ),
            element([ ])
          )
        })
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
        .condition('start time is valid', (t) => validTime(t.from))
        .condition('end time is valid', (t) => validTime(t.to))
    }
    function validTime (ti) {
      return ti.hour >= 0 && ti.hour <= 24 &&
        ti.minute >= 0 && ti.minute < 60
    }
  })

  // TODO title
  // TODO location { title, url, detail }
  // TODO summary
  // TODO description
  // TODO links
  // TODO declared
}
