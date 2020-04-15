<template>
  <ConfirmationDialog
    :confirmation-button="{ text: 'Logout', color: 'primary' }"
    :max-width="280"
    @confirm="logout"
  >
    <template v-slot:activator="{ on }">
      <slot name="activator" :on="on"></slot>
    </template>

    <template v-slot:title>You sure you want to logout?</template>

    <template v-slot:text>
      You can come back later at any time.
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
      this.$store.dispatch("auth/LOGOUT");
      this.$store.dispatch("unsetContract");
    }
  }
};
</script>
