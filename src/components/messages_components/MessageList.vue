<template>
  <v-list
    lines="two"
    subheader
    :max-height="maxHeight"
    style="overflow-y: scroll"
    role="list"
    :aria-label="ariaLabel"
    :aria-describedby="dashboard ? 'news-description' : undefined"
  >
    <template v-for="(message, index) in messages" :key="message.id">
      <MessageListItem
        :message="message"
        :dashboard="dashboard"
        role="listitem"
        :aria-posinset="index + 1"
        :aria-setsize="messages.length"
      />
      <v-divider
        v-if="index < messages.length - 1"
        :key="'divider' + index"
        role="separator"
        aria-orientation="horizontal"
      />
    </template>
  </v-list>
</template>

<script>
import MessageListItem from "@/components/messages_components/MessageListItem.vue";
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
    dashboard: {
      type: Boolean,
      default: false
    },
    maxHeight: {
      type: Number,
      required: false,
      default: 200
    },
    ariaLabel: {
      type: String,
      default: ""
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
