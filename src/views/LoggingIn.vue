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
      {{ $t("app.loggingin") }}
    </v-row>
  </v-container>
</template>

<script>
import OAuth2Service from "@/services/oauth2";

export default {
  name: "LoggingIn",
  metaInfo() {
    return {
      title: this.$t("app.loggingin")
    };
  },
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

    try {
      const response = await OAuth2Service.post(code);
      await this.$store.dispatch("auth/LOGIN_OAUTH2", response.data);

      this.$router
        .push({
          name: "dashboard"
        })
        .catch(() => {});
    } catch (error) {
      this.$store.dispatch("snackbar/setSnack", {
        snack:
          "Something went wrong with the login. Please contact the support, if this keeps happening.",
        color: "error"
      });

      this.$store.dispatch("auth/LOGOUT").catch(() => {});
    }
  }
};
</script>
