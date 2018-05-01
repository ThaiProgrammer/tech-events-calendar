<template>
  <div v-html="renderedText"/>
</template>

<script>
import MarkdownIt from 'markdown-it'

const md = MarkdownIt()

export default {
  props: {
    text: String,
    inline: Boolean
  },
  computed: {
    renderedText() {
      return this.inline ? md.renderInline(this.text) : md.render(this.text)
    }
  }
}
</script>
