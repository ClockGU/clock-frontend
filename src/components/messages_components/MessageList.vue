<template>
  <v-list two-line subheader :max-height="200" style="overflow-y: scroll">
    <template v-for="(message, index) in messages">
      <MessageListItem
        :key="message.id"
        :message="message"
        :three-line="threeLine"
      />
      <v-divider v-if="index < messages.length - 1" :key="'divider' + index" />
    </template>
  </v-list>
</template>

<script>
import MessageListItem from "@/components/messages_components/MessageListItem";
import { MESSAGE_TYPE_COLORS } from "@/utils/colors";
import { MESSAGE_TYPE_TAGS } from "@/utils/misc";
import { mdiClose } from "@mdi/js";

export default {
  name: "MessageList",
  components: { MessageListItem },
  props: {
    messages: {
      type: Array,
      default: () => []
    },
    threeLine: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    dialog: false,
    icons: { mdiClose },
    visibleMessage: null
  }),
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
