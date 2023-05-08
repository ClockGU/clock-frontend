<template>
  <v-list-item v-bind="$attrs">
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
        v-if="lineRestriction"
        class="text--primary"
        v-text="text"
      ></v-list-item-subtitle>
      <v-list-item-content v-else>
        {{ text }}
      </v-list-item-content>
    </v-list-item-content>

    <v-list-item-action>
      <v-list-item-action-text v-text="message.date"></v-list-item-action-text>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
import { MESSAGE_TYPE_COLORS } from "@/utils/colors";
import { MESSAGE_TYPE_TAGS } from "@/utils/misc";
import { marked } from "marked";

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
      return stripHTML(marked.parse(this.message.text));
    },
    lineRestriction() {
      return ["three-line", "two-line"]
        .map((restriction) => restriction in this.$attrs)
        .some((item) => item);
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
