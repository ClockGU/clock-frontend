<template>
  <PrivacyDialog />
</template>

<script>
import PrivacyDialog from "@/components/PrivacyDialog";

export default {
  name: "PrivacyAgreement",
  metaInfo() {
    return {
      title: this.$t("app.privacyagreement")
    };
  },
  components: { PrivacyDialog }
};
</script>
