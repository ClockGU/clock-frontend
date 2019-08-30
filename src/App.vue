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
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="amber" absolute text>
      <v-app-bar-nav-icon @click="toggleDrawer()">
        <v-icon v-if="!isMobile && !mini">keyboard_arrow_left</v-icon>
        <v-icon v-else-if="!isMobile && mini">keyboard_arrow_right</v-icon>
        <v-icon v-else>menu</v-icon>
      </v-app-bar-nav-icon>
      <portal-target name="toolbar"></portal-target>
    </v-app-bar>

    <v-content>
      <v-container :class="{ 'px-0': isMobile, 'py-0': isMobile }" fluid>
        <router-view></router-view>
      </v-container>
      <portal-target name="fab"></portal-target>
    </v-content>

    <TheSnackbar />
    <!-- <v-footer color="indigo" app>
      <span class="white--text">&copy; 2019</span>
    </v-footer>-->
  </v-app>
</template>

<script>
import TheSnackbar from "@/components/TheSnackbar";

export default {
  components: { TheSnackbar },
  data: () => ({
    drawer: false,
    mini: true,
    links: [
      {
        text: "Calendar",
        to: { name: "c" },
        icon: "home",
        loggedOut: true
      },
      {
        text: "Shifts",
        to: { name: "shiftList" },
        icon: "list",
        loggedOut: false
      },
      {
        text: "Add Shift",
        to: { name: "createShift" },
        icon: "add",
        lologgedOutgin: false
      },
      {
        text: "Contracts",
        to: { name: "contractList" },
        icon: "description",
        loggedOut: false
      },
      {
        text: "Clock in",
        to: { name: "clockInOut" },
        icon: "timer",
        loggedOut: false
      },
      {
        text: "Logout",
        to: { name: "logout" },
        icon: "lock",
        loggedOut: false
      }
    ]
  }),
  computed: {
    visibleLinks() {
      if (this.isLoggedIn) return this.links;

      return this.links.filter(link => link.loggedOut === true);
    },
    isMobile() {
      return this.$vuetify.breakpoint.name === "xs";
    },
    isLoggedIn() {
      return this.$store.state.auth.accessToken ? true : false;
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
