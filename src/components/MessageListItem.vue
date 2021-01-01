<template>
  <v-list-item v-bind="$attrs" @click="$emit('show', message)">
    <v-list-item-content>
      <v-list-item-title v-text="message.title"></v-list-item-title>

      <v-list-item-subtitle
        class="text--primary"
        v-text="text"
      ></v-list-item-subtitle>
    </v-list-item-content>

    <v-list-item-action>
      <v-list-item-action-text v-text="message.date"></v-list-item-action-text>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
const marked = require("marked");

const stripHTML = (string) => string.replace(/(<([^>]+)>)/gi, "");

export default {
  name: "MessageListItem",
  props: {
    message: {
      type: Object,
      required: true
    }
  },
  computed: {
    text() {
      return stripHTML(marked(this.message.text));
    }
  }
};
</script>
