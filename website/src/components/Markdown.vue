<template>
  <div v-html="renderedText"></div>
</template>

<script>
import MarkdownIt from 'markdown-it'

const md = MarkdownIt()

export default {
  props: ['text'],
  computed: {
    renderedText () {
      return md.render(this.text)
    }
  }
}
</script>
