<template>
  <div class="container-lg p-4">
    <div class="text-center p-4" v-if="loading">
      <spinner></spinner>
      <br>
      Loading event info…
    </div>
    <div v-if="!loading && !error">
      <div class="blankslate blankslate-large" v-if="!event">
        <h3>Event not found</h3>
        <p>Sorry, but the requested event cannot be found.</p>
      </div>
      <div v-if="!!event">
        <event-info :event="event"></event-info>
      </div>
    </div>
    <div class="flash flash-error" v-if="!!error">
      <strong>Cannot load data.</strong> {{error.toString()}}
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Spinner from './Spinner'
import EventInfo from './EventInfo'

export default {
  computed: {
    id () {
      return this.$route.params.id
    },
    ...mapState([ 'loading', 'error', 'events' ]),
    event () {
      return this.events.filter(e => e.id === this.id)[0]
    }
  },
  components: {
    Spinner,
    EventInfo
  }
}
</script>

<style scoped>
</style>
