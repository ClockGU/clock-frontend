<template>
  <v-app>
    <TheNavigationDrawer
      class="hidden-md-and-up"
      :drawer="drawer"
      @close-drawer="drawer = false"
    />

    <TheAppBar @toggle="toggleDrawer" />
    <TheNavigationToolbar v-if="isLoggedIn" class="hidden-sm-and-down" />

    <router-view></router-view>

    <portal-target name="dialog"></portal-target>

    <FeedbackMenu v-if="isLoggedIn" />

    <OmbudsMenu v-if="isLoggedIn" />

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
import TheDialog from "@/components/TheDialog.vue";

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
    TheDialog,
    TheAppBar,
    TheNavigationToolbar,
    TheNavigationDrawer,
    TheSnackbar,
    TheFooter,
    FeedbackMenu,
    OmbudsMenu
  },
  data: () => ({
    drawer: false
  }),
  computed: {
    ...mapState(["locale"]),
    ...mapGetters({
      isLoggedIn: "auth/loggedIn"
    })
  },
  async created() {
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
    }
  }
};
</script>
