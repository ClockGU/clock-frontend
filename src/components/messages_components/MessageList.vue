<template>
  <v-list two-line subheader>
    <template v-for="(message, index) in messages">
      <MessageListItem
        :key="message.id"
        :message="message"
        @show="showMessage"
      />
      <v-divider v-if="index < messages.length - 1" :key="index"></v-divider>
    </template>

    <v-dialog
      v-if="dialog"
      v-model="dialog"
      :max-width="900"
      @click:outside="closeMessage"
    >
      <v-card>
        <v-toolbar flat>
          <v-btn icon @click="dialog = false">
            <v-icon>{{ icons.mdiClose }}</v-icon>
          </v-btn>
          <v-toolbar-title>
            {{ visibleMessage.title }}
            <v-chip
              v-if="typeTag(visibleMessage) !== ''"
              outlined
              small
              class="ma-2"
              :color="typeColor(visibleMessage)"
            >
              {{ typeTag(visibleMessage) }}
            </v-chip>
          </v-toolbar-title>
          <v-spacer />
          {{ visibleMessage.date }}
        </v-toolbar>

        <MessageListText :text="visibleMessage.text" />
      </v-card>
    </v-dialog>
  </v-list>
</template>

<script>
import MessageListItem from "@/components/messages_components/MessageListItem";
import MessageListText from "@/components/messages_components/MessageListText";
import { MESSAGE_TYPE_COLORS } from "@/utils/colors";
import { MESSAGE_TYPE_TAGS } from "@/utils/misc";
import { mdiClose } from "@mdi/js";

export default {
  name: "MessageList",
  components: { MessageListItem, MessageListText },
  props: {
    messages: {
      type: Array,
      default: () => []
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
    },
    closeMessage() {
      this.visibleMessage = null;
      this.dialog = false;
    },
    showMessage(message) {
      this.visibleMessage = message;
      this.dialog = true;
    }
  }
};
</script>
