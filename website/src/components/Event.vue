<template>
  <div class="event">
    <div class="event-date">
      <strong>{{date}}</strong><br>{{day}}
    </div>
    <div class="event-details">
      <div class="event-title">
        <strong>
          <router-link :to="href">{{event.title}}</router-link>
        </strong>
      </div>
      <div class="event-summary">
        {{event.summary}}
      </div>
      <div class="event-tags f6 mt-1">
        <span href="#" class="event-tag" v-for="category in event.categories">{{category}}</span>
        <span href="#" class="event-tag" v-for="topic in event.topics">{{topic}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [ 'event' ],
  computed: {
    date () {
      const month = ['?', 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'][this.event.start.month]
      return `${month} ${this.event.start.date}`
    },
    day () {
      const date = new Date(this.event.start.year, this.event.start.month - 1, this.event.start.date)
      return ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][date.getDay()]
    },
    href () {
      return `/events/${this.event.id}`
    }
  }
}
</script>

<style scoped>
.event {
  display: flex;
}
.event-date {
  width: 10em;
}
.event-details {
  flex: 1;
}
.event-tags {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
}
.event-tag {
  border-radius: 3px;
  background: #FAF8D1;
  color: #f49200;
  padding: 0.3em 0.9em;
  margin-right: 0.5em;
  white-space: nowrap;
  text-decoration: none;
}
</style>
