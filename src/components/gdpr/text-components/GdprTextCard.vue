<template>
  <v-card>
    <v-toolbar flat class="text-h5 text--secondary font-weight-bold">
      {{ $t("app.privacyagreement") }}
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn icon @click="close">
          <v-icon>{{ icons.mdiClose }}</v-icon>
        </v-btn>
      </v-toolbar-items>
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
