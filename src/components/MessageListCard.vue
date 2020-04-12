<template>
  <v-card>
    <v-card-title>
      Notifications
    </v-card-title>

    <v-card-text class="pa-0">
      <v-row v-if="numberOfMessages < 1" justify="center">
        <v-container fluid>
          <v-row justify="center">
            <p>You have no notifications. Good job!</p>
          </v-row>
          <v-row justify="center">
            <UndrawNotify height="200" />
          </v-row>
        </v-container>
      </v-row>

      <MessageList v-else :messages="recentMessages" />
    </v-card-text>

    <v-card-actions>
      <v-slide-x-transition>
        <v-btn v-if="numberOfMessages > 0" text color="deep-purple accent-4">
          See all
        </v-btn>
      </v-slide-x-transition>
      <v-spacer></v-spacer>
      <v-btn @click="addMessage">Add message</v-btn>
      <v-btn @click="clearMessages">Clear messages</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
import { mdiInformationOutline } from "@mdi/js";

import MessageList from "@/components/MessageList";

import UndrawNotify from "vue-undraw/UndrawNotify";

export default {
  name: "MessageListCard",
  components: { MessageList, UndrawNotify },
  data: () => ({
    icons: {
      mdiInformationOutline
    }
  }),
  computed: {
    ...mapGetters({
      numberOfMessages: "messages/numberOfMessages",
      messages: "messages/getMessages"
    }),
    recentMessages() {
      return this.messages.slice(0, 5);
    }
  },
  methods: {
    addMessage() {
      const message = {
        type: "warning",
        title: "A TITLE",
        text: "THIS IS A WARNING!",
        expires: null
      };
      this.$store.dispatch("messages/addMessage", message);
    },
    clearMessages() {
      this.$store.dispatch("messages/clearMessages");
    }
  }
};
</script>

<style lang="scss" scoped></style>
