<template>
  <v-card>
    <v-skeleton-loader
      v-if="loading"
      class="mx-auto pt-4"
      max-width="300"
      type="card"
    />

    <template v-else>
      <v-card-title>{{ $t("app.news") }}</v-card-title>

      <v-card-text v-if="noMessages">{{ $t("news.noNews") }}</v-card-text>
      <v-card-text v-else>
        <MessageList :messages="messages" three-line />
      </v-card-text>
      <v-card-actions v-if="!noMessages">
        <FullMessageListDialog :messages="messages" />
      </v-card-actions>
    </template>
  </v-card>
</template>

<script>
import { log } from "@/utils/log";

import MessageList from "@/components/messages_components/MessageList.vue";

import { mdiClose } from "@mdi/js";
import FullMessageListDialog from "@/components/messages_components/fullMessageListDialog.vue";
import { mapGetters } from "vuex";

export default {
  name: "DashboardMessageList",
  components: {
    MessageList,
    FullMessageListDialog
  },
  data: () => ({
    dialog: false,
    icons: {
      mdiClose
    }
  }),
  computed: {
    ...mapGetters({
      messages: "message/messages",
      loading: "message/loading"
    }),
    lastMessage() {
      return this.messages.slice(0, 1);
    },
    noMessages() {
      return this.messages.length < 1;
    }
  },
  async created() {
    try {
      await Promise.all([this.$store.dispatch("message/queryMessage")]);
    } catch (error) {
      log(error);
      this.error = true;
    } finally {
      this.loading = false;
    }
  }
};
</script>
