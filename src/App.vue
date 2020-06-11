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

import { handleApiError } from "@/utils/interceptors";

import { mapGetters } from "vuex";

export default {
  name: "App",
  metaInfo: {
    title: "Dein flexibler Stundenzettel",
    titleTemplate: "Clock - %s"
  },
  components: {
    TheAppBar,
    TheNavigationToolbar,
    TheNavigationDrawer,
    TheSnackbar,
    TheFooter
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
  watch: {
    $route(to, from) {
      if (to.name === from.name) return;
      this.loadClockedShift();
    }
  },
  created() {
    if (!this.isLoggedIn) return;
    this.$store.dispatch("GET_USER");
  },
  methods: {
    loadClockedShift() {
      if (!this.isLoggedIn) return;
      this.$store.dispatch("clock/GET_CLOCKED_SHIFT").catch(handleApiError);
    },
    toggleDrawer() {
      this.drawer = !this.drawer;
    }
  }
};
</script>
