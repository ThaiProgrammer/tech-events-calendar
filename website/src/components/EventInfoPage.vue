<template>
  <div class="container-lg p-4">
    <div
      v-if="loading"
      class="text-center p-4">
      <spinner/>
      <br>
      Loading event info…
    </div>
    <div v-if="!loading && !error">
      <div
        v-if="!event"
        class="blankslate blankslate-large">
        <h3>Event not found</h3>
        <p>Sorry, but the requested event cannot be found.</p>
      </div>
      <div v-if="!!event">
        <event-info :event="event"/>
      </div>
    </div>
    <div
      v-if="!!error"
      class="flash flash-error">
      <strong>Cannot load data.</strong> {{ error.toString() }}
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Spinner from './Spinner'
import EventInfo from './EventInfo'

export default {
  components: {
    Spinner,
    EventInfo
  },
  computed: {
    id() {
      return this.$route.params.id
    },
    ...mapState(['loading', 'error', 'events']),
    event() {
      return this.events.filter(e => e.id === this.id)[0]
    }
  }
}
</script>

<style scoped>
</style>
