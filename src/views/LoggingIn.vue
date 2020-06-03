<template>
  <v-container>
    <v-row justify="center">
      <v-progress-circular
        :size="70"
        :width="7"
        color="primary"
        indeterminate
      ></v-progress-circular>
    </v-row>
    <v-row class="mt-10" justify="center">
      Logging in...
    </v-row>
  </v-container>
</template>

<script>
import OAuth2Service from "@/services/oauth2";

export default {
  name: "LoggingIn",
  beforeRouteEnter(to, from, next) {
    if (to.query.code === undefined) {
      next({ name: "home" });
    }

    next();
  },
  async mounted() {
    const { code } = this.$route.query;

    // Replace the history entry to remove the auth code form the browser address bar
    window.history.replaceState({}, null, "/");

    const response = await OAuth2Service.post(code);

    this.$store.dispatch("auth/LOGIN_OAUTH2", response.data);
    this.$router.push({ name: "dashboard" });
  }
};
</script>
