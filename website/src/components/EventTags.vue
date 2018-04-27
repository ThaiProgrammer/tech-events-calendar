<template>
  <div class="event-tags f6">
    <span 
      v-for="category in event.categories" 
      class="event-tag">{{ category }}</span>
    <span 
      v-for="topic in event.topics" 
      class="event-tag">{{ topic }}</span>
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
  background: #faf8d1;
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
  props: ['event']
}
</script>
