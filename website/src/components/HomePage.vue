<template>
  <div class="container-lg p-4">
    <div class="Subhead">
      <h2 class="Subhead-heading">Upcoming events</h2>
      <div class="Subhead-actions">
        <router-link to="/list" class="btn btn-sm btn-secondary">Event list</router-link>
      </div>
    </div>
    <p>
      These are the upcoming tech events.
      You can subscribe to the calendar via <a href="https://calendar.google.com/calendar/embed?src=j5i0o6v2ihfboe19upl9lhonbci6ankr%40import.calendar.google.com&ctz=Asia%2FBangkok">Google Calendar</a>.
    </p>
    <div class="Box mt-4">
      <ul>
        <li class="Box-row" v-for="event in upcomingEvents">
          <event :event="event"></event>
        </li>
        <li class="Box-row text-center p-4" v-if="loading">
          <spinner></spinner>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Event from './Event'
import Spinner from './Spinner'

export default {
  computed: {
    ...mapState([ 'loading', 'error', 'events' ]),
    upcomingEvents () {
      const now = new Date()
      now.setHours(0, 0, 0, 0)
      return this.events
        .filter(event => {
          const date = new Date(event.start.year, event.start.month - 1, event.start.date)
          return date >= now
        })
        .slice(0, 5)
    }
  },
  components: { Event, Spinner }
}
</script>

<style scoped>
</style>
