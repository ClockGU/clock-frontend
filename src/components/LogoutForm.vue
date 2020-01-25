<template>
  <v-card data-cy="logout-form">
    <v-card-title class="headline word-break">
      You sure you want to logout?
    </v-card-title>
    <v-card-text>You can come back later at any time.</v-card-text>
    <v-card-actions>
      <v-btn data-cy="logout" color="primary" text @click="logout">
        Logout
      </v-btn>
      <v-btn data-cy="cancel" text @click="close">Cancel</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "LogoutForm",
  data: () => ({
    username: null,
    password: null
  }),
  methods: {
    close() {
      this.$emit("close");
    },
    logout() {
      this.$store.dispatch("auth/LOGOUT");
      this.$store.dispatch("unsetContract");

      this.close();
    }
  }
};
</script>
