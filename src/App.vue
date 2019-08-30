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
        <v-list-item v-for="link in links" :key="link.text" exact :to="link.to">
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
      <v-container fluid>
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
        icon: "home"
      },
      {
        text: "Shifts",
        to: { name: "shiftList" },
        icon: "list"
      },
      {
        text: "Add Shift",
        to: { name: "createShift" },
        icon: "add"
      },
      {
        text: "Contracts",
        to: { name: "contractList" },
        icon: "description"
      },
      {
        text: "Clock in",
        to: { name: "clockInOut" },
        icon: "lock"
      }
    ]
  }),
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.name === "xs";
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
