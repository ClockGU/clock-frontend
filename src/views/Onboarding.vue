<template>
  <OnboardDialog />
</template>

<script>
import OnboardDialog from "@/components/OnboardDialog";

export default {
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
