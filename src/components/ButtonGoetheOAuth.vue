<template>
  <v-btn :color="color" :loading="loading" v-bind="$attrs" @click="login">
    <slot></slot>
  </v-btn>
</template>

<script>
import { log } from "@/utils/log";
import OAuth2Service from "@/services/oauth2";

export default {
  name: "ButtonGoetheOAuth",
  props: {
    color: {
      type: String,
      default: "primary darken-1"
    }
  },
  data: () => ({
    loading: false
  }),
  methods: {
    async login() {
      this.loading = true;
      try {
        const response = await OAuth2Service.get();
        const { authorization_url } = response.data;

        window.location = authorization_url;

        setTimeout(() => {
          this.loading = false;
        }, 5000);
      } catch (error) {
        // TODO: Put component into error state
        await this.$store.dispatch("snackbar/setSnack", {
          snack: this.$t("feedback.snackbar.error"),
          timeout: 4000,
          color: "error"
        });
        this.loading = false;

        log(error);
      }
    }
  }
};
</script>
