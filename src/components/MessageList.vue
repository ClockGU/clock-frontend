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

    <v-dialog v-if="dialog" v-model="dialog" :max-width="900" @click:outside="closeMessage">
      <v-card>
        <v-toolbar flat>
          <v-btn icon @click="dialog = false">
            <v-icon>{{ icons.mdiClose }}</v-icon>
          </v-btn>
          <v-toolbar-title>
            {{ visibleMessage.title }}
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
import MessageListItem from "@/components/MessageListItem";
import MessageListText from "@/components/MessageListText";

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
