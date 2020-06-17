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
import { getContractWithLastActivity } from "@/utils";

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

    const response = await OAuth2Service.post(code);

    await this.$store.dispatch("auth/LOGIN_OAUTH2", response.data);

    // TODO: We get some weird error if we do not redirect to a concrete
    // dashboard view with a set contract param
    const shifts = await this.$store.dispatch("shift/queryShifts");
    const contracts = await this.$store.dispatch("contract/queryContracts");
    await this.$store.dispatch("report/list");

    if (contracts.length < 1) {
      return this.$router.push({ name: "onboarding" });
    }

    const uuid = getContractWithLastActivity({ shifts, contracts });

    this.$router.push({
      name: "dashboard",
      params: { contract: uuid }
    });
  }
};
</script>
