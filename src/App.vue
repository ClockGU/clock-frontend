<template>
  <v-app>
    <TheNavigationDrawer
      class="hidden-md-and-up"
      :drawer="drawer"
      @closeDrawer="drawer = false"
      @logout="logoutDialog = true"
    />

    <TheAppBar @logout="logoutDialog = true" @toggle="toggleDrawer" />
    <TheNavigationToolbar v-if="isLoggedIn" class="hidden-sm-and-down" />

    <router-view></router-view>

    <TheDialog v-if="logoutDialog" @close="logoutDialog = false">
      <template v-slot:content>
        <LogoutForm @close="logoutDialog = false" />
      </template>
    </TheDialog>
    <portal-target name="dialog"></portal-target>

    <TheSnackbar />
    <TheFooter />
  </v-app>
</template>

<script>
import LogoutForm from "@/components/LogoutForm";
import TheAppBar from "@/components/TheAppBar";
import TheNavigationToolbar from "@/components/TheNavigationToolbar";
import TheDialog from "@/components/TheDialog";
import TheNavigationDrawer from "@/components/TheNavigationDrawer";
import TheSnackbar from "@/components/TheSnackbar";
import TheFooter from "@/components/TheFooter";

import { mapGetters } from "vuex";

export default {
  components: {
    LogoutForm,
    TheAppBar,
    TheNavigationToolbar,
    TheNavigationDrawer,
    TheDialog,
    TheSnackbar,
    TheFooter
  },
  data: () => ({
    drawer: false,
    logoutDialog: false
  }),
  computed: {
    ...mapGetters({
      isLoggedIn: "auth/loggedIn"
    })
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
