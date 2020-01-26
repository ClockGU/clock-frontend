<template>
  <v-app>
    <TheNavigationDrawer
      class="hidden-md-and-up"
      :drawer="drawer"
      @closeDrawer="drawer = false"
    />

    <TheAppBar @logout="logoutDialog = true" @toggle="toggleDrawer" />
    <TheNavigationAppBar class="hidden-sm-and-down" />

    <!-- <v-content> -->
    <!-- <v-container fluid style="height: 100%" :class="containerClasses"> -->
    <router-view></router-view>

    <TheDialog v-if="logoutDialog" @close="logoutDialog = false">
      <template v-slot:content>
        <LogoutForm @close="logoutDialog = false" />
      </template>
    </TheDialog>
    <!-- </v-container> -->
    <portal-target name="dialog"></portal-target>
    <portal-target name="fab"></portal-target>
    <!-- </v-content> -->

    <TheSnackbar />
    <v-footer color="blue lighten-1" inset absolute app>
      <span class="white--text">&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
import LogoutForm from "@/components/LogoutForm";
import TheAppBar from "@/components/TheAppBar";
import TheNavigationAppBar from "@/components/TheNavigationAppBar";
import TheDialog from "@/components/TheDialog";
import TheNavigationDrawer from "@/components/TheNavigationDrawer";
import TheSnackbar from "@/components/TheSnackbar";

import { mapGetters } from "vuex";

export default {
  components: {
    LogoutForm,
    TheAppBar,
    TheNavigationAppBar,
    TheNavigationDrawer,
    TheDialog,
    TheSnackbar
  },
  data: () => ({
    drawer: false,
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
      this.drawer = !this.drawer;
    }
  }
};
</script>
