<template>
  <v-app>
    <TheNavigationDrawer
      class="hidden-md-and-up"
      :drawer="drawer"
      @closeDrawer="drawer = false"
    />

    <TheAppBar @toggle="toggleDrawer" />
    <TheNavigationToolbar
      v-if="isLoggedIn && hasContracts && !showOverride"
      class="hidden-sm-and-down"
    />

    <router-view></router-view>

    <portal-target name="dialog"></portal-target>

    <FeedbackMenu v-if="isLoggedIn" />

    <TheSnackbar />
    <TheFooter />
  </v-app>
</template>

<script>
import TheAppBar from "@/components/TheAppBar";
import TheNavigationToolbar from "@/components/TheNavigationToolbar";
import TheNavigationDrawer from "@/components/TheNavigationDrawer";
import TheSnackbar from "@/components/TheSnackbar";
import TheFooter from "@/components/TheFooter";
import FeedbackMenu from "@/components/FeedbackMenu";

import { mapGetters } from "vuex";

export default {
  name: "App",
  metaInfo() {
    return {
      title: this.$t("app.mainTitle"),
      titleTemplate: "Clock - %s"
    };
  },
  components: {
    TheAppBar,
    TheNavigationToolbar,
    TheNavigationDrawer,
    TheSnackbar,
    TheFooter,
    FeedbackMenu
  },
  data: () => ({
    drawer: false
  }),
  computed: {
    ...mapGetters({
      isLoggedIn: "auth/loggedIn",
      contracts: "contract/contracts"
    }),
    hasContracts() {
      return this.contracts.length > 0;
    },
    showOverride() {
      return this.$route.name === "imprint" || this.$route.name === "privacy";
    }
  },
  created() {
    if (!this.isLoggedIn) return;
    this.$store.dispatch("GET_USER").catch(() => {});
  },
  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer;
    }
  }
};
</script>
