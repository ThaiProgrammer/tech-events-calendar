<template>
  <div class="event-tags f6">
    <span class="event-tag" v-for="category in event.categories">{{category}}</span>
    <span class="event-tag" v-for="topic in event.topics">{{topic}}</span>
  </div>
</template>

<style scoped>
.event-tags {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  margin-top: -0.5em;
}
.event-tag {
  border-radius: 3px;
  background: #FAF8D1;
  color: #f49200;
  padding: 0.3em 0.9em;
  margin-right: 0.5em;
  margin-top: 0.5em;
  white-space: nowrap;
  text-decoration: none;
}
</style>

<script>
export default {
  props: [ 'event' ]
}
</script>
