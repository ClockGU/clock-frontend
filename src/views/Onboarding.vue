<template>
  <OnboardDialog />
</template>

<script>
import OnboardDialog from "@/components/OnboardDialog.vue";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Onboarding",
  metaInfo() {
    return {
      title: this.$t("app.onboarding")
    };
  },
  components: { OnboardDialog }
  // methods: {
  //   finishOnboarding() {
  //     this.showOnboardingDialog = false;
  //   }
  // }
};
</script>
