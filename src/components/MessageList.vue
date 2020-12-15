<template>
  <v-list two-line subheader>
    <template v-for="(message, index) in messages">
      <MessageListItem :key="message.title" :message="message" @show="showMessage" />

      <v-divider
        v-if="index < messages.length - 1"
        :key="index"
      ></v-divider>
    </template>

    <v-dialog v-if="dialog" v-model="dialog" @click:outside="closeMessage">
      <v-card>
        <v-toolbar flat>
          <v-btn icon @click="dialog = false">
            <v-icon>{{ icons.mdiClose }}</v-icon>
          </v-btn>
          <v-toolbar-title>
            {{ message.title }}
          </v-toolbar-title>
          <v-spacer />
          {{ message.distance }}
        </v-toolbar>

        <v-card-text>{{ message.text }}</v-card-text>
      </v-card>
    </v-dialog>
  </v-list>
</template>

<script>
import MessageListItem from "@/components/MessageListItem"
import { mdiClose } from "@mdi/js";

export default {
  name: "MessageList",
  components: { MessageListItem },
  props: {
    messages: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    dialog: false,
    icons: { mdiClose },
    message: null,
  }),
  methods: {
    closeMessage() {
      this.message = null;
      this.dialog = false;
    },
    showMessage(message) {
      this.message = message;
      this.dialog = true
    }
  }
}
</script>
