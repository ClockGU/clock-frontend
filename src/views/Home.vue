<template>
  <v-main>
    <v-alert
      v-if="userCheckedOut !== ''"
      type="info"
      color="purple"
      density="compact"
    >
      You are viewing data of a different user.
      <v-btn size="small" variant="outlined" class="ml-4" @click="clear"
        >Clear User</v-btn
      >
    </v-alert>
    <v-alert v-if="staging" type="warning" density="compact">{{
      infostring
    }}</v-alert>
    <v-container :style="styles" style="height: 100%" fluid>
      <router-view></router-view>
    </v-container>

    <portal-target name="fab"></portal-target>
  </v-main>
</template>

<script>
import { mapGetters } from "vuex";
import ApiService from "@/services/api.js";
import { useDisplay } from "vuetify";

export default {
  name: "Home",
  computed: {
    ...mapGetters({ userCheckedOut: "auth/checkoutUser" }),
    styles() {
      let styles;
      const {smAndDown} = useDisplay();
      const removePadding =
        smAndDown ||
        this.showingCalendar ||
        this.$route.path === "/";
      if (removePadding) {
        styles = {
          padding: "0"
        };
      }

      return styles;
    },
    staging() {
      return import.meta.env.VUE_APP_ENV === "staging";
    },
    infostring() {
      return import.meta.env.VUE_APP_LOCAL === "true"
        ? "Staging (local)"
        : "Staging (server)";
    }
  },
  methods: {
    clear() {
      ApiService.removeSingleHeader("Checkoutuser");
      this.$store.commit("auth/CLEAR_CHECKOUT_USER");
      this.$store.commit("contentData/clearContentData");
      this.$router.go();
    }
  }
};
</script>
