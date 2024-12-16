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
    <p v-else v-html="text"></p>
    <v-list-item-action v-if="messageDate">
      <p class="font-weight-bold">{{ messageDate }}</p>
      >
      <!-- Displaying the formatted date -->
    </v-list-item-action>
  </v-list-item>
</template>

<script>
import { MESSAGE_TYPE_COLORS } from "@/utils/colors";
import { MESSAGE_TYPE_TAGS } from "@/utils/misc";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { mapGetters } from "vuex";
import { parseISO } from "date-fns";
import { localizedFormat } from "@/utils/date";

const stripHTML = (string) => string.replace(/(<([^>]+)>)/gi, "");

export default {
  name: "MessageListItem",
  props: {
    message: {
      type: Object,
      required: true
    },
    dashboard: {
      type: Boolean,
      default: false
    },
    lineRestriction: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      locale: "locale"
    }),
    text() {
      return DOMPurify.sanitize(marked.parse(this.text_value(this.message)));
    },
    strippedText() {
      return stripHTML(this.text);
    },
    messageDate() {
      return localizedFormat(parseISO(this.message.valid_from), "dd.MM.yyyy");
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

<style lang="css" scoped>
.message {
  line-height: 1.75em;
}
</style>
