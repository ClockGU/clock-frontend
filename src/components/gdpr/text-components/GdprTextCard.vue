<template>
  <v-card>
    <v-toolbar flat class="text-h5 text--secondary font-weight-bold">
      <v-toolbar-title>
        {{ $t("app.privacyagreement") }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn :icon="icons.mdiClose" @click="close" />
    </v-toolbar>
    <v-card-text>
      <GdprText :dialog="true"></GdprText>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn variant="text" color="primary" @click="close">
        {{ $t("actions.close") }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import GdprText from "@/components/gdpr/text-components/GdprText.vue";
import { mdiClose } from "@mdi/js";

export default {
  name: "GdprTextCard",
  components: { GdprText },
  emits: ["close"],
  data() {
    return {
      icons: { mdiClose }
    };
  },
  methods: {
    close() {
      this.$emit("close");
    }
  }
};
</script>
