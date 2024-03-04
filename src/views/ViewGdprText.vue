<template>
  <GdprText />
</template>

<script>
import GdprText from "@/components/gdpr/text-components/GdprText.vue";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Privacy",
  components: { GdprText },
  metaInfo() {
    return {
      title: this.$t("app.privacy")
    };
  }
};
</script>
