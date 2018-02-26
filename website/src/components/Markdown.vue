<template>
  <div v-html="renderedText"></div>
</template>

<script>
import MarkdownIt from 'markdown-it'

const md = MarkdownIt()

export default {
  props: [ 'text', 'inline' ],
  computed: {
    renderedText () {
      return this.inline ? md.renderInline(this.text) : md.render(this.text)
    }
  }
}
</script>
