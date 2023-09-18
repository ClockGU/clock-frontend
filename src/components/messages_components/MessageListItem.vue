<template>
  <v-list-item v-bind="$attrs">
    <v-list-item-title>
      {{ title_value(message) }}
      <v-chip
        v-if="typeTag(message) !== ''"
        variant="outlined"
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

    <v-list-item-action>
      <v-list-item-action-text v-text="message.date"></v-list-item-action-text>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
import { MESSAGE_TYPE_COLORS } from "@/utils/colors";
import { MESSAGE_TYPE_TAGS } from "@/utils/misc";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { mapGetters } from "vuex";

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
    ...mapGetters({
      locale: "locale"
    }),
    text() {
      return stripHTML(
        DOMPurify.sanitize(marked.parse(this.text_value(this.message)))
      );
    },
    lineRestriction() {
      return ["three-line", "two-line"]
        .map((restriction) =>
          restriction in this.$attrs ? this.$attrs[restriction] : false
        )
        .some((item) => item);
    }
  },
  methods: {
    title_value(message) {
      const key = `${this.locale}_title`;
      return key === undefined ? message.en_title : message[key];
    },
    text_value(message) {
      const key = `${this.locale}_text`;
      return key === undefined ? message.en_text : message[key];
    },
    typeColor(message) {
      return MESSAGE_TYPE_COLORS[message.type];
    },
    typeTag(message) {
      return MESSAGE_TYPE_TAGS[message.type];
    }
  }
};
</script>
