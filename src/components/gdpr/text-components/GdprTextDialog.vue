<template>
  <v-dialog v-model="dialog" scrollable max-width="600">
    <template #activator="{ props }">
      <a v-bind="props">{{ $t("app.privacyagreement") }}</a>
    </template>
    <GdprTextCard @close="dialog = false"></GdprTextCard>
  </v-dialog>
</template>

<script>
import GdprTextCard from "@/components/gdpr/text-components/GdprTextCard.vue";
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
