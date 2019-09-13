<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="mini && !isMobile"
      :permanent="!isMobile"
      app
      class="grey lighten-4"
    >
      <v-list>
        <v-list-item v-if="isLoggedIn">
          <v-list-item-avatar color="blue" size="24">
            <span class="white--text">{{ firstLetter }}</span>
          </v-list-item-avatar>

          <v-list-item-content>{{ name }}</v-list-item-content>
        </v-list-item>

        <v-list-item
          v-for="link in visibleLinks"
          :key="link.text"
          exact
          :to="link.to"
        >
          <v-list-item-action>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-item-action>

          <v-list-item-content>{{ link.text }}</v-list-item-content>
        </v-list-item>

        <v-list-item v-if="isLoggedIn" @click="logoutDialog = true">
          <v-list-item-action>
            <v-icon>lock</v-icon>
          </v-list-item-action>

          <v-list-item-content>Logout</v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app dark color="blue" absolute text>
      <v-app-bar-nav-icon @click="toggleDrawer()">
        <v-icon v-if="!isMobile && !mini">keyboard_arrow_left</v-icon>
        <v-icon v-else-if="!isMobile && mini">keyboard_arrow_right</v-icon>
        <v-icon v-else>menu</v-icon>
      </v-app-bar-nav-icon>
      <!-- <portal-target name="toolbar"></portal-target> -->
      <template v-if="showSelectContractButton">
        <v-btn text :to="{ path: '/select/' }" exact>
          {{ selectedContract }}
        </v-btn>
        <ClockInOut />
      </template>
    </v-app-bar>

    <v-content>
      <v-container fluid>
        <v-breadcrumbs
          v-if="breadcrumbList !== null"
          :items="breadcrumbList"
          divider=">"
        ></v-breadcrumbs>
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
import TheDialog from "@/components/TheDialog";
import TheSnackbar from "@/components/TheSnackbar";
import LogoutForm from "@/components/LogoutForm";
import ClockInOut from "@/components/ClockInOut";

export default {
  components: { ClockInOut, TheDialog, TheSnackbar, LogoutForm },
  data: () => ({
    drawer: false,
    mini: true,
    logoutDialog: false,
    links: [
      {
        text: "Home",
        to: { name: "c" },
        icon: "home",
        loggedOut: true
      },
      {
        text: "Contracts",
        to: { name: "contractList" },
        icon: "description",
        loggedOut: false
      }
    ],
    breadcrumbList: null
  }),
  computed: {
    showSelectContractButton() {
      return this.$store.state.selectedContract !== null;
    },
    selectedContract() {
      if (this.$store.state.selectedContract === null) return;
      return this.$store.state.selectedContract.name;
    },
    name() {
      return this.$store.state.user.first_name;
    },
    firstLetter() {
      if (this.$store.state.user.first_name.length === 0) return "";

      return this.$store.state.user.first_name.substring(0, 1);
    },
    visibleLinks() {
      if (this.isLoggedIn && this.$store.state.selectedContract !== null)
        return this.links;

      return this.links.filter(link => link.loggedOut === true);
    },
    isMobile() {
      return this.$vuetify.breakpoint.name === "xs";
    },
    isLoggedIn() {
      return this.$store.state.auth.accessToken ? true : false;
    }
  },
  watch: {
    $route() {
      this.breadcrumbList = this.$route.meta.breadcrumb;
    }
  },
  methods: {
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
