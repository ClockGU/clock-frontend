<template>
  <GdprText />
</template>

<script>
import GdprText from "@/components/gdpr/text-components/GdprText.vue";
export default {
  name: "Privacy",
  components: { GdprText },
  metaInfo() {
    return {
      title: this.$t("app.privacy")
    };
  }
};
</script>
