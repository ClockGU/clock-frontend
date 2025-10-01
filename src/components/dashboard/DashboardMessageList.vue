<template>
  <v-card tabindex="0" role="region" aria-labelledby="news-header">
    <v-skeleton-loader
      v-if="loading"
      class="mx-auto pt-4"
      max-width="300"
      type="card"
      :aria-label="$t('aria.news.loading')"
    />

    <template v-else>
      <v-card-title>
        <h2 id="news-header" >{{ $t("app.news") }}</h2>
      </v-card-title>

      <v-card-text v-if="noMessages">
        <p id="news-description">{{ $t("news.noNews") }}</p>
      </v-card-text>

      <div v-else>
        <v-card-text>
          <p id="news-description" class="sr-only">
            {{
              $t("aria.news.accessibleDescription", { count: messages.length })
            }}
          </p>
          <MessageList
            :messages="messages"
            dashboard
            :aria-label="$t('aria.news.listDescription')"
          />
        </v-card-text>
        <v-card-actions>
          <FullMessageListDialog :messages="messages" />
        </v-card-actions>
      </div>
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
    loading: false,
    icons: {
      mdiClose
    }
  }),
  computed: {
    ...mapGetters({
      messages: "message/messages"
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
      this.loading = true;
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
