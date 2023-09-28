<template>
  <TheDialog
    :persistent="false"
    :fullscreen="smAndDown"
    :max-width="800"
  >
    <template #activator="props">
      <v-btn variant="text" color="primary" block v-bind="props">
        {{ $t("news.showAll") }}
      </v-btn>
    </template>

    <template #content="{ events: { close } }">
      <v-card>
        <CardToolbar
          :title="$t('app.news')"
          :logout-action="false"
          close-action
          @close="close"
        ></CardToolbar>
        <v-card-text>
          <MessageList :messages="messages" :max-height="600" />
        </v-card-text>
      </v-card>
    </template>
  </TheDialog>
</template>

<script>
import TheDialog from "@/components/TheDialog.vue";
import MessageList from "@/components/messages_components/MessageList.vue";
import CardToolbar from "@/components/cards/CardToolbar.vue";
import { useDisplay } from "vuetify";
export default {
  name: "FullMessageListDialog",
  components: { TheDialog, MessageList, CardToolbar },
  props: {
    messages: {
      type: Array,
      required: true
    }
  },
  computed: {
    smAndDown() {
      const { smAndDown } = useDisplay();
      return smAndDown;
    },
  }
};
</script>
