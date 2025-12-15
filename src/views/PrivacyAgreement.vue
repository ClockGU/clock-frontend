<template>
  <div>
    <v-dialog
      v-model="dialog"
      :aria-label="$t('aria.dialogs.gdpr')"
      :fullscreen="smAndDown"
      max-width="600"
      persistent
      no-click-animation
      @keydown.esc="closeDialog"
    >
      <GdprAgreementCard />
    </v-dialog>
    <FeedbackMenu />
  </div>
</template>

<script>
import GdprAgreementCard from "@/components/gdpr/GdprAgreementCard.vue";
import FeedbackMenu from "@/components/FeedbackMenu.vue";
export default {
  name: "PrivacyAgreement",
  metaInfo() {
    return {
      title: this.$t("app.privacyagreement")
    };
  },
  components: { GdprAgreementCard, FeedbackMenu },
  emits: ["close"],
  data() {
    return {
      dialog: true
    };
  },
  computed: {
    smAndDown() {
      return this.$vuetify.display.smAndDown;
    }
  },
  methods: {
    closeDialog() {
      this.$emit("close");
    }
  }
};
</script>
