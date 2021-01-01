<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <v-card-text v-html="sanitizedHTML"></v-card-text>
</template>

<script>
import DOMPurify from 'dompurify';
const marked = require("marked");

marked.setOptions({
  silent: true
})

export default {
  name: "MessageListText",
  props: {
    text: {
      type: String,
      required: true
    }
  },
  computed: {
    dirtyHTML() {
      return marked(this.text);
    },
    sanitizedHTML() {
      return DOMPurify.sanitize(this.dirtyHTML);
    }
  }
}
</script>
