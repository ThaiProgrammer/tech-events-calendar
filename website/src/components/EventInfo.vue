<template>
  <div>
    <div class="Subhead">
      <h2 class="Subhead-heading">{{ event.title }}</h2>
      <div class="mt-1">
        <event-tags :event="event"/>
      </div>
    </div>
    <div class="clearfix mt-4">
      <div class="col-lg-3 col-md-4 col-sm-6 col-12 pr-4 float-left">
        <div class="Box Box--condensed info-box">
          <ul>
            <li class="Box-row info-row">
              <span class="info-icon">
                <octicon name="calendar"/>
              </span>
              <span class="info-text">
                <strong>{{ startDate }}</strong> ({{ day(event.start) }})
                <span v-if="startDate !== endDate"> ~ <strong>{{ endDate }}</strong> ({{ day(event.end) }})</span>
              </span>
            </li>
            <li
              v-if="event.time && event.time.length > 0"
              class="Box-row info-row">
              <span class="info-icon">
                <octicon name="clock"/>
              </span>
              <div class="info-text">
                <div
                  v-for="(t, index) in event.time"
                  :key="index"
                  class="info-time">
                  <strong>{{ formatTime(t.from) }} ~ {{ formatTime(t.to) }}{{ t.after ? '++' : '' }}</strong>
                  <span
                    v-if="t.agenda"
                    class="info-extended text-gray f6">{{ t.agenda }}</span>
                </div>
              </div>
            </li>
            <li class="Box-row info-row">
              <span class="info-icon">
                <octicon name="location"/>
              </span>
              <span class="info-text">
                <a
                  v-if="event.location.url && event.location.url !== 'TBD'"
                  :href="event.location.url"
                  target="_blank">{{ event.location.title }}</a>
                <acronym
                  v-if="event.location.url === 'TBD'"
                  title="To be determined">{{ event.location.title }}</acronym>
                <span
                  v-if="event.location.detail"
                  class="info-extended text-gray f6">
                  <markdown
                    :text="event.location.detail"
                    :inline="true"/>
                </span>
              </span>
            </li>
          </ul>
        </div>

        <nav class="menu mt-4">
          <span class="menu-heading">Links</span>
          <a
            v-for="link in event.links"
            :key="link.url"
            :href="link.url"
            class="menu-item">
            {{ link.title }} <span class="text-gray f6">({{ link.type }})</span>
            <span
              v-if="link.detail"
              class="info-extended text-gray f6">{{ link.detail }}</span>
            <span
              v-if="link.price"
              class="info-extended text-gray f6">{{ link.price }}</span>
          </a>
        </nav>

        <nav
          v-if="event.resources && event.resources.length > 0"
          class="menu mt-4">
          <span class="menu-heading">Official Resources</span>
          <a
            v-for="resource in event.resources"
            :key="resource.url"
            :href="resource.url"
            class="menu-item">
            {{ resource.title }} <span class="text-gray f6">({{ resource.type }})</span>
            <span
              v-if="resource.detail"
              class="info-extended text-gray f6">{{ resource.detail }}</span>
          </a>
        </nav>

        <nav
          v-if="event.communityResources && event.communityResources.length > 0"
          class="menu mt-4">
          <span class="menu-heading">Community Resources</span>
          <a
            v-for="resource in event.communityResources"
            :key="resource.url"
            :href="resource.url"
            class="menu-item">
            {{ resource.title }} <span class="text-gray f6">({{ resource.type }})</span>
            <span
              v-if="resource.detail"
              class="info-extended text-gray f6">{{ resource.detail }}</span>
          </a>
        </nav>
      </div>
      <div class="col-lg-9 col-md-8 col-12 float-left">
        <div class="markdown-body">
          <markdown :text="description"/>
        </div>
        <div class="d-flex flex-items-baseline">
          <p class="flex-auto" />
          <p class="text-right mt-4">
            <a
              :href="editLink"
              class="btn btn-secondary">Edit on GitHub</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Octicon from 'vue-octicon/components/Octicon'
import EventTags from './EventTags'
import Markdown from './Markdown'
import { MONTHS, DAYS } from '../utils'

export default {
  components: {
    Octicon,
    EventTags,
    Markdown
  },
  props: {
    event: Object
  },
  computed: {
    startDate() {
      return this.formatDate(this.event.start)
    },
    endDate() {
      return this.formatDate(this.event.end)
    },
    editLink() {
      return `https://thaiprogrammer-tech-events-calendar.spacet.me/go/?edit=${
        this.event.id
      }`
    },
    href() {
      return `/event/${this.event.id}`
    },
    description() {
      return `> ${this.event.summary}\n\n${this.event.description}`
    }
  },
  methods: {
    formatDate(d) {
      return `${MONTHS[d.month - 1]} ${d.date}`
    },
    day(d) {
      const date = new Date(d.year, d.month - 1, d.date)
      return DAYS[date.getDay()]
    },
    formatTime(t) {
      return `${t.hour}:${t.minute < 10 ? '0' : ''}${t.minute}`
    }
  }
}
</script>

<style scoped>
.info-box .info-row {
  padding: 8px 10px;
  display: flex;
}
.info-icon {
  margin-right: 5px;
}
.info-extended {
  display: block;
  padding-left: 12px;
}
</style>
