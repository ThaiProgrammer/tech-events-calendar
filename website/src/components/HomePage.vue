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
    <div class="flash flash-error" v-if="!!error">
      <strong>Cannot load data.</strong> {{error.toString()}}
    </div>
    <div class="Box mt-4" v-if="loading">
      <ul>
        <li class="Box-row text-center p-4">
          <spinner></spinner>
        </li>
      </ul>
    </div>
    <div class="Box mt-4" v-if="topUpcomingEvents.length > 0">
      <ul>
        <li class="Box-row" v-for="event in topUpcomingEvents">
          <event :event="event"></event>
        </li>
      </ul>
      <div class="Box-footer Box-row--gray text-center" v-if="upcomingEvents.length > topUpcomingEvents.length">
        <router-link to='/list'>See more events &rarr;</router-link>
      </div>
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
    },
    topUpcomingEvents () {
      return this.upcomingEvents.slice(0, 5)
    }
  },
  components: { Event, Spinner }
}
</script>

<style scoped>
</style>
