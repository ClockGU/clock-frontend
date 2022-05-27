<template>
  <v-dialog v-model="dialog" scrollable max-width="600">
    <template #activator="{ on, attrs }">
      <a v-bind="attrs" v-on="on">{{ $t("app.privacyagreement") }}</a>
    </template>
    <GdprTextCard @close="dialog = false"></GdprTextCard>
  </v-dialog>
</template>

<script>
import GdprTextCard from "@/components/gdpr/text-components/GdprTextCard";
export default {
  name: "GdprTextDialog",
  components: { GdprTextCard },
  data() {
    return {
      dialog: false
    };
  }
};
</script>
