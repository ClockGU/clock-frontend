<template>
  <v-card>
    <v-card-title class="headline">You sure you want to logout?</v-card-title>
    <v-card-text>You can come back later at any time.</v-card-text>
    <v-card-actions>
      <div class="flex-grow-1"></div>
      <v-btn color="green darken-1" text @click="close">Cancel</v-btn>
      <v-btn color="green darken-1" text @click="logout">Logout</v-btn>
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
      this.$store.dispatch("auth/logout");
      this.$store.dispatch("unsetContract");

      this.close();
    }
  }
};
</script>
