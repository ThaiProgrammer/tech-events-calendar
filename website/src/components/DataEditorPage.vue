<template>
  <div class="container-lg p-4">
    <div class="Subhead">
      <div class="Subhead-heading">Event data editor</div>
    </div>
    <details class="mb-3">
      <summary>tools</summary>
      <div class="d-flex flex-items-baseline">
        <div class="col-2 p-2">
          categories
        </div>
        <div class="col-10 p-2">
          <button
            v-for="(cat, index) of availableCategories"
            :key="index"
            :class="{ selected: isCategorySelected(cat) }"
            class="btn btn-sm mr-1"
            @click="toggleCategory(cat)"
          >
            {{ cat }}
          </button>
        </div>
      </div>
      <div class="d-flex flex-items-baseline">
        <div class="col-2 p-2">
          data assistant
        </div>
        <div class="col-10 p-2">
          <input
            v-model="textToAssist"
            class="form-control input-block"
            type="text"
            placeholder="enter a URL, place, or topic"
          >
          <button
            v-if="!suggestedActions.length"
            disabled
            class="btn btn-sm mr-1 mt-1"
          >
            No suggested actions
          </button>
          <button
            v-for="(suggestedAction, index) in suggestedActions"
            :key="index"
            class="btn btn-sm mr-1 mt-1"
            @click="suggestedAction.perform()"
          >
            <span>{{ suggestedAction.title }}</span>
          </button>
        </div>
      </div>
    </details>
    <textarea
      ref="textarea"
      v-model="text"
      class="form-control input-monospace"
      style="width: 100%; height: 25em;"
      @dragover="$event.preventDefault()"
      @drop="handleDrop($event)"
    />
    <br>
    <br>
    <div
      class="Box"
      style="overflow: auto; height: 15em"
    >

      <div
        v-for="(problem, index) in problems"
        :key="index"
        class="flash flash-error m-2 p-2"
      >
        <strong>{{ problem.title }}:</strong> {{ problem.message }}
      </div>
      <div
        v-if="!problems.length"
        class="flash flash-success m-2"
      >
        <form
          action="https://github.com/ThaiProgrammer/tech-events-calendar/new/master"
          target="_blank"
        >
          <input
            :value="targetFilename"
            type="hidden"
            name="filename"
          >
          <button
            type="submit"
            class="btn btn-sm btn-primary flash-action"
            @click="copyText()"
          >Copy text and submit event</button>
          No problems found.
        </form>
      </div>
    </div>
    <br>
    <details>
      <summary>event preview</summary>
      <EventInfo
        v-if="parsed.event"
        :event="parsed.event"
      />
    </details>
    <br>
    <details>
      <summary>detailed checks</summary>
      <div class="checks markdown-body">
        <DataChecks
          v-if="parsed.checks"
          :checks="parsed.checks"
        />
      </div>
    </details>
    <br>
    <details>
      <summary>parsed event</summary>
      <div class="checks">
        <pre wrap>{{ parsedJson }}</pre>
      </div>
    </details>
  </div>
</template>

<script>
import ical from 'ical/ical'
import yaml from 'js-yaml'
import fuzzy from 'fuzzaldrin-plus'
import formatJson from 'format-json'
import frontMatter from 'front-matter'
import parseMarkdown from '../../../lib/parseMarkdown'
import DataChecks from './DataChecks'
import EventInfo from './EventInfo'

const template = `---
id: TODO
date: 'TODO'
time: TODO
location:
  title: TODO
  url: TODO
categories:
  - TODO
topics:
  - TODO
links:
  - type: website
    url: TODO
    title: TODO
  - type: ticket
    url: TODO
    title: TODO
    price: TODO
  - type: rsvp
    url: TODO
    title: TODO
---

# TODO

> TODO

TODO`

export default {
  components: {
    DataChecks,
    EventInfo
  },
  data() {
    const text = this.updateText(sessionStorage.text || template, x => x)
    return {
      text,
      textToAssist: '',
      parsed: this.parseText(text),
      availableCategories: [
        'Codefest',
        'Conference',
        'Hackathon',
        'Meetup',
        'Seminar',
        'Workshop',
        'Exposition'
      ]
    }
  },
  computed: {
    suggestedActions() {
      return getSuggestedActions(this.textToAssist, {
        modifyText: this.modifyText,
        availableTopics: this.$store.getters.topics,
        availableLocations: this.$store.getters.locations
      })
    },
    targetFilename() {
      const folder = [
        this.parsed.event.start.year,
        this.parsed.event.start.month.toString().padStart(2, 0)
      ].join('-')
      return `data/${folder}/${this.parsed.event.id}.md`
    },
    parsedJson() {
      if (this.parsed.event) {
        return formatJson.diffy(this.parsed.event)
      }
      return '-'
    },
    problems() {
      const problems = []
      if (this.parsed.checks) {
        const traverseCheck = (check, prefix = '') => {
          if (check.type === 'item') {
            for (const child of check.children)
              traverseCheck(child, `${prefix} > ${check.title}`)
          } else if (check.type === 'check') {
            if (!check.result.status) {
              problems.push({
                title: `${prefix} > ${check.title}`,
                message: check.result.message || 'not pass'
              })
            }
          }
        }
        for (const check of this.parsed.checks) traverseCheck(check)
      }
      if (this.parsed.event) {
        const { event } = this.parsed
        if (!event.categories || !event.categories.length) {
          problems.push({
            title: 'categories',
            message: 'should not be empty'
          })
        }
        if (!event.location || !event.location.url) {
          problems.push({
            title: 'location',
            message: 'should have a url'
          })
        }
        const summary = event.summary ? event.summary.trim() : ''
        if (!summary) {
          problems.push({
            title: 'summary',
            message: 'should not be blank'
          })
        }
        if (summary.length > 280) {
          problems.push({
            title: 'summary',
            message: `is too long (${
              summary.length
            }) — please reduce to 280 chars`
          })
        }
      }
      return problems
    }
  },
  watch: {
    text() {
      if (this.parseTimeout) clearTimeout(this.parseTimeout)
      this.parseTimeout = setTimeout(() => {
        if (this.cachedText !== this.text) {
          this.cachedText = this.text
          this.parsed = this.parseText(this.text)
          sessionStorage.text = this.text
        }
      }, 500)
    }
  },
  methods: {
    copyText() {
      this.$refs.textarea.focus()
      this.$refs.textarea.select()
      document.execCommand('copy')
    },
    toggleCategory(category) {
      this.modifyText(data => {
        const d = data
        if (d.categories.includes(category)) {
          d.categories.splice(d.categories.indexOf(category), 1)
        } else {
          d.categories = [...d.categories, category].filter(x => x !== 'TODO')
        }
      })
    },
    isCategorySelected(category) {
      return (
        this.parsed.event &&
        this.parsed.event.categories &&
        this.parsed.event.categories.includes(category)
      )
    },
    parseText(text) {
      try {
        return parseMarkdown(text, {})
      } catch (e) {
        console.error(e)
        return { error: e }
      }
    },
    updateText(text, f) {
      const data = frontMatter(text)
      data.attributes = data.attributes || {}
      f(data.attributes)
      return [
        '---\n',
        yaml.safeDump(data.attributes, { lineWidth: 999 }),
        '---\n',
        data.body
      ].join('')
    },
    modifyText(f) {
      this.text = this.updateText(this.text, f)
    },
    async handleDrop(e) {
      e.preventDefault()
      try {
        const file = e.dataTransfer.files[0]
        const contents = await readFile(file)
        const events = ical.parseICS(contents)
        const event = events[Object.keys(events)[0]]
        console.log(event)
        const description = event.description.replace(/http[\S]+\s*$/, '')
        this.text = `# ${event.summary}\n\n> ${description.trim()}`
        this.modifyText(d => {
          const data = d
          data.id = event.uid.replace(/@.*/, '')
          const start = serializeDate(event.start)
          const end = serializeDate(event.end)
          data.date = start === end ? start : `${start} ~ ${end}`
          if (start === end) {
            data.time = [
              serializeTime(event.start),
              serializeTime(event.end)
            ].join(' ~ ')
          }
          data.location = {
            title: event.location,
            url: 'TODO'
          }
          data.categories = ['TODO']
          data.topics = ['TODO']
          data.links = [
            { type: 'website', url: 'TODO', title: 'TODO' },
            { type: 'ticket', url: 'TODO', title: 'TODO', price: 'TODO' },
            { type: 'rsvp', url: event.url, title: 'Facebook event' }
          ]
        })
      } catch (error) {
        window.alert(`Cannot process: ${error}`)
        throw error
      }
    }
  }
}

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve(reader.result)
    }
    reader.onerror = reject
    reader.readAsText(file)
  })
}

/**
 * @param {Date} d
 */
function serializeDate(d) {
  return [
    d.getFullYear(),
    (d.getMonth() + 1).toString().padStart(2, 0),
    d
      .getDate()
      .toString()
      .padStart(2, 0)
  ].join('-')
}
/**
 * @param {Date} d
 */
function serializeTime(d) {
  return [
    d.getHours(),
    d
      .getMinutes()
      .toString()
      .padStart(2, 0)
  ].join(':')
}

function getSuggestedActions(
  textToAssist,
  { availableTopics, availableLocations, modifyText }
) {
  const actions = []
  const suggest = (title, perform) => actions.push({ title, perform })
  {
    const m = textToAssist.match(
      /^https:\/\/www\.google\.[^/]+\/maps\/place\/([^?]+)/
    )
    if (m) {
      const url = `https://www.google.com/maps/place/${m[1]}`
      const locationTitle = decodeURIComponent(
        m[1].split('/')[0].replace(/[+]/g, ' ')
      )
      suggest(`Set location to ${locationTitle}`, () => {
        modifyText(d => {
          const data = d
          if (!data.location) data.location = {}
          data.location.url = url
          if (!data.location.title || data.location.title === 'TODO') {
            data.location.title = locationTitle
          }
        })
      })
    }
  }
  {
    const m = textToAssist.match(/^https:\/\/www\.eventpop\.me/)
    if (m) {
      const url = textToAssist
      suggest('Add ticket URL', () => {
        modifyText(
          addLink({
            type: 'ticket',
            title: 'Event Pop',
            url,
            price: 'TODO'
          })
        )
      })
    }
  }
  {
    const m = textToAssist.match(/^https:\/\/dev\.wi\.th/)
    if (m) {
      const url = textToAssist
      suggest('Add ticket URL', () => {
        modifyText(
          addLink({
            type: 'ticket',
            title: 'devcamp',
            url,
            price: 'TODO'
          })
        )
      })
    }
  }
  {
    const m = textToAssist.match(
      /^https:\/\/(?:www|web)\.facebook\.com\/events\/(\d+)/
    )
    if (m) {
      const url = `https://www.facebook.com/events/${m[1]}/`
      suggest('Add RSVP URL', () => {
        modifyText(
          addLink({
            type: 'rsvp',
            title: 'Facebook',
            url
          })
        )
      })
      suggest('Download ICS file', () => {
        const icsUrl = `https://www.facebook.com/events/ical/export?eid=${m[1]}`
        window.open(icsUrl, '_blank')
      })
    }
  }
  if (!actions.length && textToAssist.length) {
    const matchedTopics = fuzzy.filter(availableTopics, textToAssist)
    for (const topic of matchedTopics.slice(0, 3)) {
      suggest(`Add topic “${topic}”`, () => {
        modifyText(addTopic(topic))
      })
    }
    const matchedLocations = fuzzy.filter(availableLocations, textToAssist, {
      key: 'title'
    })
    for (const location of matchedLocations.slice(0, 3)) {
      suggest(`Location: “${location.title}”`, () => {
        modifyText(data => {
          const d = data
          d.location = location
        })
      })
    }
  }
  return actions
}
function addLink(link) {
  const typeOrder = ['website', 'ticket', 'rsvp']
  return data => {
    const d = data
    if (!d.links) d.links = []
    d.links = [
      ...(d.links || []).filter(
        l => !(l.type === link.type && (l.url === 'TODO' || l.url === link.url))
      ),
      link
    ].sort((a, b) => typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type))
  }
}
function addTopic(topic) {
  return data => {
    const d = data
    if (d.topics && d.topics.includes(topic)) return
    d.topics = [...(d.topics || []), topic].filter(t => t !== 'TODO')
  }
}
</script>
