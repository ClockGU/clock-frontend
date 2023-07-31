<template>
  <ConfirmationDialog
    :confirmation-button="{ text: $t('actions.logout'), color: 'primary' }"
    :max-width="600"
    @confirm="logout"
  >
    <template #activator="{ on }">
      <slot name="activator" :on="on"></slot>
    </template>

    <template #title>{{ $t("logout.title") }}</template>

    <template #text>
      {{ $t("logout.message") }}
    </template>
  </ConfirmationDialog>
</template>

<script>
import ConfirmationDialog from "@/components/ConfirmationDialog";

export default {
  name: "LogoutDialog",
  components: { ConfirmationDialog },
  methods: {
    logout() {
      this.$store.dispatch("auth/LOGOUT").then(() => {
        this.$store.dispatch("unsetContract");
      });
    }
  }
};
</script>
