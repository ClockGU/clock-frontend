<template>
  <div>
    <v-dialog
      v-model="dialog"
      :fullscreen="$vuetify.breakpoint.smAndDown"
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
import GdprAgreementCard from "@/components/gdpr/GdprAgreementCard";
import FeedbackMenu from "@/components/FeedbackMenu";
export default {
  name: "PrivacyAgreement",
  metaInfo() {
    return {
      title: this.$t("app.privacyagreement")
    };
  },
  components: { GdprAgreementCard, FeedbackMenu },
  data() {
    return {
      dialog: true
    };
  },
  methods: {
    closeDialog() {
      this.$emit("close");
    }
  }
};
</script>
