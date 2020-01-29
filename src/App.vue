<template>
  <v-app>
    <TheNavigationDrawer
      :drawer="drawer"
      :is-mobile="isMobile"
      :mini="mini"
      @logout="logoutDialog = true"
      @closeDrawer="drawer = false"
    />

    <TheAppBar :is-mobile="isMobile" :mini="mini" @toggle="toggleDrawer()" />

    <v-content>
      <v-container fluid style="height: 100%" :class="containerClasses">
        <router-view></router-view>

        <TheDialog v-if="logoutDialog" @close="logoutDialog = false">
          <template v-slot:content>
            <LogoutForm @close="logoutDialog = false" />
          </template>
        </TheDialog>
      </v-container>
      <portal-target name="dialog"></portal-target>
      <portal-target name="fab"></portal-target>
    </v-content>

    <TheSnackbar />
    <v-footer color="blue lighten-1" inset absolute app>
      <span class="white--text">&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
import LogoutForm from "@/components/LogoutForm";
import TheAppBar from "@/components/TheAppBar";
import TheDialog from "@/components/TheDialog";
import TheNavigationDrawer from "@/components/TheNavigationDrawer";
import TheSnackbar from "@/components/TheSnackbar";

import { mapGetters } from "vuex";

export default {
  components: {
    LogoutForm,
    TheAppBar,
    TheNavigationDrawer,
    TheDialog,
    TheSnackbar
  },
  data: () => ({
    drawer: false,
    mini: true,
    logoutDialog: false
  }),
  computed: {
    ...mapGetters({
      isLoggedIn: "auth/loggedIn"
    }),
    containerClasses() {
      const showingCalendar =
        this.$route.name === "calendar" || this.$route.name === "c";
      return showingCalendar ? { "pa-0": true } : {};
    },
    isMobile() {
      return this.$vuetify.breakpoint.name === "xs";
    }
  },
  watch: {
    $route() {
      this.loadClockedShift();
    }
  },
  mounted() {
    this.loadClockedShift();
  },
  methods: {
    loadClockedShift() {
      if (!this.isLoggedIn) return;
      this.$store.dispatch("shift/queryClockedShift");
    },
    toggleDrawer() {
      if (this.isMobile) {
        this.drawer = !this.drawer;
      } else {
        this.mini = !this.mini;
      }
    }
  }
};
</script>
