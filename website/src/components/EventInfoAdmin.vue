<template>
  <div>
    <div class="markdown-body mt-3">
      <h2>Share this event on Facebook page</h2>
      <p>Note: You must be a Facebook page admin.</p>
      <ol>
        <li>
          <p>
            <button
              class="btn btn-outline"
              type="button"
              @click="copyText()">Copy</button> the announcement text.
          </p>
        </li>
        <li>
          <p>
            <button
              class="btn btn-outline"
              type="button"
              @click="openShareDialog()">Share</button> the event on Facebook, pasting the copied text.
          </p>
          <ul>
            <li>Make sure to share on <strong>calendar.thaiprogrammer.org</strong> page.</li>
          </ul>
        </li>
      </ol>
      <h3>Announcement text</h3>
      <p>
        <textarea
          ref="textarea"
          :value="announcement"
          class="form-control input-monospace"
          style="width: 100%; height: 12em;"
          @dragover="$event.preventDefault()"
          @drop="handleDrop($event)"
        />
      </p>
    </div>
  </div>
</template>

<script>
import { MONTHS, DAYS } from '../utils'

export default {
  props: {
    event: Object
  },
  computed: {
    announcement() {
      return getEventText(this.event)
    }
  },
  methods: {
    copyText() {
      this.$refs.textarea.focus()
      this.$refs.textarea.select()
      document.execCommand('copy')
    },
    openShareDialog() {
      const { event } = this
      const pageUrl = `https://calendar.thaiprogrammer.org/event/${event.id}`
      const fbEventLink = event.links.filter(link =>
        /https:\/\/(?:www|web)\.facebook\.com\/events\/\d+/.test(link.url)
      )[0]
      const fbEventUrl = fbEventLink && fbEventLink.url
      const link = fbEventUrl || pageUrl
      const shareQuery = [
        'app_id=1894360754189647',
        'display=popup',
        `href=${encodeURIComponent(link)}`
      ].join('&')
      const shareUrl = `https://www.facebook.com/dialog/share?${shareQuery}`
      window.open(shareUrl, '_blank')
    }
  }
}

function getEventText(event) {
  const url = `https://calendar.thaiprogrammer.org/event/${event.id}`
  const location = event.location && event.location.title
  const text = [
    `[Event] ${event.title}`,
    `${dates(event)}${location ? ` @ ${location}` : ''}`,
    '',
    `${event.summary}`,
    `${hashtags([...event.categories, ...event.topics])}`,
    url
  ].join('\n')
  return text
}

function hashtags(tags) {
  return tags.map(x => `#${x.replace(/[^a-zA-Z0-9_]/g, '')}`).join(' ')
}

function dateOf({ year, month, date }) {
  return new Date(year, month - 1, date)
}

function dates(event) {
  const formatDate = ({ year, month, date }) => {
    const day = dateOf({ year, month, date }).getDay()
    return `${MONTHS[month - 1]} ${date} (${DAYS[day]})`
  }
  const formatTime = t => `${t.hour}:${t.minute < 10 ? '0' : ''}${t.minute}`
  const start = formatDate(event.start)
  const end = formatDate(event.end)
  const time =
    event.time && event.time.length === 1
      ? `${formatTime(event.time[0].from)} ~ ${formatTime(event.time[0].to)}`
      : ''
  return `${start}${end !== start ? ` ~ ${end}` : ''}${time ? `, ${time}` : ''}`
}
</script>

<style scoped>
button.btn {
  vertical-align: baseline;
}
</style>
