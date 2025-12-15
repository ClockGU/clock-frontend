<template>
  <v-list-item v-bind="$attrs" :aria-labelledby="`message-title-${message.id}`">
    <v-list-item-title>
      <span :id="`message-title-${message.id}`" class="visually-hidden">
        {{ accessibleTitle }}
      </span>
      <span aria-hidden="true">
        {{ title_value(message) }}
        <v-chip
          v-if="typeTag(message) !== ''"
          variant="outlined"
          small
          class="ma-2"
          :color="typeColor(message)"
          :aria-label="typeTag(message)"
        >
          {{ typeTag(message) }}
        </v-chip>
      </span>
    </v-list-item-title>

    <v-list-item-subtitle
      v-if="lineRestriction"
      class="text--primary"
      :aria-describedby="`message-content-${message.id}`"
    >
      <span :id="`message-content-${message.id}`" class="visually-hidden">
        {{ strippedText }}
      </span>
      <span aria-hidden="true" v-text="text"></span>
    </v-list-item-subtitle>

    <div v-else>
      <div :id="`message-content-${message.id}`" class="visually-hidden">
        {{ strippedText }}
      </div>
      <div aria-hidden="true" v-html="text"></div>
    </div>

    <v-list-item-action>
      <p class="font-weight-bold py-4">
        <span class="visually-hidden">{{ $t("news.validity") }}: </span>
        <span aria-hidden="true">{{ $t("news.validity") }}</span>
        <span class="pl-2" :aria-label="accessibleDate">
          {{ messageDate }}
        </span>
      </p>
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
    },
    accessibleDate() {
      // Use a more descriptive format for screen readers
      const date = parseISO(this.message.valid_from);
      if (this.locale === "de") {
        return localizedFormat(date, "EEEE, d. MMMM yyyy");
      } else {
        return localizedFormat(date, "EEEE, MMMM d, yyyy");
      }
    },
    accessibleTitle() {
      const title = this.title_value(this.message);
      const tag = this.typeTag(this.message);
      return tag
        ? this.$t("aria.news.messageWithTag", { title, tag })
        : this.$t("aria.news.messageTitle", { title });
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
