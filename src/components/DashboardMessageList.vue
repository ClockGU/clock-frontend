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

      <MessageList v-else :messages="lastMessage" />

      <v-card-actions v-if="!noMessages">
        <TheDialog
          v-model="dialog"
          :persistent="false"
          :fullscreen="$vuetify.breakpoint.smAndDown"
          :max-width="800"
        >
          <template #activator="{ on }">
            <v-btn text color="primary" block v-on="on">{{ $t("news.showAll")}}</v-btn>
          </template>

          <template #content>
            <v-card>
              <v-toolbar flat>
                <v-btn icon @click="dialog = false">
                  <v-icon>{{ icons.mdiClose }}</v-icon>
                </v-btn>
                <v-toolbar-title>
                  {{ $t("app.news") }}
                </v-toolbar-title>
              </v-toolbar>

              <v-card-text>
                <MessageList :messages="messages" />
              </v-card-text>
            </v-card>
          </template>
        </TheDialog>
      </v-card-actions>
    </template>
  </v-card>
</template>

<script>
import { log } from "@/utils/log";
import MessageService from "@/services/message";

import TheDialog from "@/components/TheDialog";
import MessageList from "@/components/MessageList";

import { parseISO } from "date-fns";
import { localizedFormat } from "@/utils/date";

import { mdiClose } from "@mdi/js";

export default {
  name: "DashboardMessageList",
  components: {
    MessageList,
    TheDialog
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
      return this.messages.slice(0,1)
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
          .map(item => {
            return {
              ...item,
              date: localizedFormat(parseISO(item.valid_from), "do MMMM yyyy")
            };
          })
          //sort by valid_from date or ID (= message last entered)
          //.sort((a, b) => new Date(a.date) - new Date(b.date));
          .sort((a, b) => (b.id - a.id));

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
