<template>
  <OnboardDialog />
</template>

<script>
import OnboardDialog from "@/components/OnboardDialog";

export default {
  name: "Onboarding",
  metaInfo: {
    title: "Onboarding"
  },
  components: { OnboardDialog }
  // methods: {
  //   finishOnboarding() {
  //     this.showOnboardingDialog = false;
  //   }
  // }
};
</script>
