<template>
  <v-app>
    <TheNavigationDrawer
      class="hidden-md-and-up"
      :drawer="drawer"
      @close-drawer="drawer = false"
    />
    <TheAppBar @toggle="toggleDrawer" />
    <TheNavigationToolbar v-if="isLoggedIn" class="hidden-sm-and-down" />
    <v-main>
      <h1 class="visually-hidden">CLOCK -{{ viewName }}</h1>
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
      <v-alert
        v-if="staging"
        type="warning"
        density="compact"
        class="pa-2 mx-4"
        >{{ infostring }}</v-alert
      >
      <v-container :style="styles" style="height: 100%">
        <router-view></router-view>
      </v-container>

      <portal-target name="fab"></portal-target>
    </v-main>
    <portal-target name="dialog"></portal-target>

    <div class="menus">
      <FeedbackMenu v-if="isLoggedIn" />

      <OmbudsMenu v-if="isLoggedIn" />
    </div>

    <TheSnackbar />
    <TheFooter />
  </v-app>
</template>

<script>
import TheAppBar from "@/components/TheAppBar.vue";
import TheNavigationToolbar from "@/components/TheNavigationToolbar.vue";
import TheNavigationDrawer from "@/components/TheNavigationDrawer.vue";
import TheSnackbar from "@/components/TheSnackbar.vue";
import TheFooter from "@/components/TheFooter.vue";
import FeedbackMenu from "@/components/FeedbackMenu.vue";
import OmbudsMenu from "@/components/OmbudsMenu.vue";

import { log } from "@/utils/log";

import { mapGetters, mapState } from "vuex";
import ApiService from "@/services/api";

export default {
  name: "App",
  metaInfo() {
    return {
      title: this.$t("app.mainTitle"),
      titleTemplate:
        import.meta.env.VUE_APP_ENV === "staging"
          ? "Clock-Staging - %s"
          : "Clock - %s"
    };
  },
  components: {
    TheAppBar,
    TheNavigationToolbar,
    TheNavigationDrawer,
    TheSnackbar,
    TheFooter,
    FeedbackMenu,
    OmbudsMenu
  },
  data: () => ({
    drawer: false,
    loading: true
  }),
  computed: {
    ...mapState(["locale"]),
    ...mapGetters({
      isLoggedIn: "auth/loggedIn",
      userCheckedOut: "auth/checkoutUser"
    }),
    viewName() {
      const routeNames = {
        home: this.$t("screen-reader-annoucemet.views.home"),
        faq: this.$t("screen-reader-annoucemet.views.faq"),
        onboarding: this.$t("screen-reader-annoucemet.views.onboarding"),
        imprint: this.$t("screen-reader-annoucemet.views.imprint"),
        privacy: this.$t("screen-reader-annoucemet.views.privacy"),
        loggingIn: this.$t("screen-reader-annoucemet.views.loggingIn"),
        dashboard: this.$t("screen-reader-annoucemet.views.dashboard"),
        calendar: this.$t("screen-reader-annoucemet.views.calendar"),
        shiftList: this.$t("screen-reader-annoucemet.views.shifts"),
        contractList: this.$t("screen-reader-annoucemet.views.contracts"),
        reporting: this.$t("screen-reader-annoucemet.views.reporting"),
        settings: this.$t("screen-reader-annoucemet.views.settings"),
        privacyagreement: this.$t("screen-reader-annoucemet.views.privacyAgreement"),
        404: this.$t("screen-reader-annoucemet.views.notFound")
      };

      return routeNames[this.$route.name] || "";
    },
    showingCalendar() {
      return this.$route.name === "calendar" || this.$route.name === "c";
    },
    styles() {
      let styles;
      const smAndDown = this.$vuetify.display.smAndDown;
      const removePadding =
        smAndDown || this.showingCalendar || this.$route.path === "/";
      if (removePadding) {
        styles = {
          padding: "0"
        };
      }

      return styles;
    },
    staging() {
      return import.meta.env.VITE_ENV === "staging";
    },
    infostring() {
      return import.meta.env.VITE_LOCAL === "true"
        ? "Staging (local)"
        : "Staging (server)";
    }
  },
  async created() {
    document.documentElement.setAttribute("lang", this.locale);
    await this.$store.dispatch("changeLocale", this.locale);
    if (!this.isLoggedIn) return;
    try {
      const { data } = await this.$store.dispatch("GET_USER");
      this.$i18n.locale = data.language || "de";
    } catch (error) {
      log(error);
    }
  },
  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer;
    },
    clear() {
      ApiService.removeSingleHeader("Checkoutuser");
      this.$store.commit("auth/CLEAR_CHECKOUT_USER");
      this.$store.commit("contentData/clearContentData");
      this.$router.go();
    }
  }
};
</script>
<style>
/* Global screen-reader utility */
.visually-hidden {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border-width: 0 !important;
}

.menus {
  position: fixed;
  bottom: 0em;
  left: 1em;
  z-index: 1;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
