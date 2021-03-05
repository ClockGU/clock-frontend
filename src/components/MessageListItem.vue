<template>
  <v-list-item v-bind="$attrs" three-line @click="$emit('show', message)">
    <v-list-item-content>
      <v-list-item-title>
        {{ message.title }}
        <v-chip
          v-if="typeTag(message) !== ''"
          outlined
          small
          class="ma-2"
          :color="typeColor(message)"
        >
          {{ typeTag(message) }}
        </v-chip>
      </v-list-item-title>

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
import { MESSAGE_TYPE_COLORS } from "@/utils/colors";
import { MESSAGE_TYPE_TAGS } from "@/utils/misc";
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
  },
  methods: {
    typeColor(message) {
      return MESSAGE_TYPE_COLORS[message.type];
    },
    typeTag(message) {
      return MESSAGE_TYPE_TAGS[message.type];
    }
  }
};
</script>
