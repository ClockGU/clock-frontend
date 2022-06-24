<template>
  <v-card-actions>
    <v-btn text color="primary" :disabled="!value || loading" @click="save">
      {{ $t("actions.complete") }}
    </v-btn>
  </v-card-actions>
</template>

<script>
import AuthService from "@/services/auth";
import { log } from "@/utils/log";

export default {
  name: "GdprCardActions",
  props: {
    value: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      loading: false
    };
  },
  methods: {
    async save() {
      this.loading = true;
      try {
        await AuthService.updateSettings({
          dsgvo_accepted: true
        });

        await this.$store.dispatch("GET_USER");

        this.$router
          .push({
            name: "dashboard"
          })
          .catch(() => {});
      } catch (error) {
        await this.$store.dispatch("snackbar/setSnack", {
          snack: this.$t("snackbar.error"),
          timeout: 4000,
          color: "warning"
        });

        // TODO: Set error state
        log(error);
      } finally {
        setTimeout(() => {
          this.loading = false;
        }, 500);
      }
    }
  }
};
</script>
