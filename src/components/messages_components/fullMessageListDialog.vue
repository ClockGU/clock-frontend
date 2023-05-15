<template>
  <TheDialog
    :persistent="false"
    :fullscreen="$vuetify.breakpoint.smAndDown"
    :max-width="800"
  >
    <template #activator="{ on }">
      <v-btn text color="primary" block v-on="on">
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
import TheDialog from "@/components/TheDialog";
import MessageList from "@/components/messages_components/MessageList";
import CardToolbar from "@/components/cards/CardToolbar";
export default {
  name: "FullMessageListDialog",
  components: { TheDialog, MessageList, CardToolbar },
  props: {
    messages: {
      type: Array,
      required: true
    }
  }
};
</script>

<style scoped></style>
