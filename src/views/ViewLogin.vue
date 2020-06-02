<template>
  <v-row
    :align="$vuetify.breakpoint.mdAndUp ? 'center' : null"
    :justify="$vuetify.breakpoint.mdAndUp ? 'center' : null"
  >
    <v-col cols="12" md="6" class="py-0">
      <LoginForm />
    </v-col>
    <v-btn @click="login">OAuth2 login</v-btn>
  </v-row>
</template>

<script>
import LoginForm from "@/components/LoginForm";

import OAuth2Service from "@/services/oauth2";

export default {
  name: "ViewLogin",
  components: { LoginForm },
  async mounted() {
    const { code } = this.$route.query;

    // Do nothing if we got no code as query parameter
    if (code === undefined) return;

    // Replace the history entry to remove the auth code form the browser address bar
    window.history.replaceState({}, null, "/");

    const response = await OAuth2Service.post(code);

    this.$store.dispatch("auth/LOGIN_OAUTH2", response.data);
    this.$router.push({ name: "contractSelect" });
  },
  methods: {
    async login() {
      const response = await OAuth2Service.get();
      const { authorization_url } = response.data;

      window.location = authorization_url;
    }
  }
};
</script>
