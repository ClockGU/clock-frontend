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
import MessageService from "@/services/message";

import MessageList from "@/components/messages_components/MessageList";

import { parseISO } from "date-fns";
import { localizedFormat } from "@/utils/date";

import { mdiClose } from "@mdi/js";
import FullMessageListDialog from "@/components/messages_components/fullMessageListDialog";

export default {
  name: "DashboardMessageList",
  components: {
    MessageList,
    FullMessageListDialog
  },
  data: () => ({
    dialog: false,
    loading: true,
    icons: {
      mdiClose
    },
    messages: []
  }),
  computed: {
    lastMessage() {
      return this.messages.slice(0, 1);
    },
    noMessages() {
      return this.messages.length < 1;
    }
  },
  created() {
    this.request();
  },
  methods: {
    async request() {
      this.loading = true;
      try {
        const { data } = await MessageService.get();
        this.messages = data
          .map((item) => {
            return {
              ...item,
              date: localizedFormat(parseISO(item.valid_from), "do MMMM yyyy")
            };
          })
          //sort by valid_from date or ID (= message last entered)
          //.sort((a, b) => new Date(a.date) - new Date(b.date));
          .sort((a, b) => b.id - a.id);
      } catch (error) {
        this.messages = [];
        log(error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
