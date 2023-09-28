<template>
  <div>
    <v-dialog
      v-model="dialog"
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
import { useDisplay } from "vuetify";
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
  computed: {
    smAndDown() {
      const { smAndDown } = useDisplay();
      return smAndDown;
    }
  },
  methods: {
    closeDialog() {
      this.$emit("close");
    }
  }
};
</script>
