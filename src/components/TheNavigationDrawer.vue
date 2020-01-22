<template>
  <v-navigation-drawer
    v-model="drawer"
    :mini-variant="mini && !isMobile"
    :permanent="!isMobile"
    app
    class="grey lighten-4"
  >
    <v-list data-cy="menu-list">
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

      <v-list-item
        v-if="isLoggedIn"
        data-cy="menu-logout"
        @click="$emit('logout')"
      >
        <v-list-item-action>
          <v-icon>{{ icons.mdiLock }}</v-icon>
        </v-list-item-action>

        <v-list-item-content>Logout</v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from "vuex";

import {
  mdiHome,
  mdiFileDocument,
  mdiLock,
  mdiTextboxPassword,
  mdiHelp,
  mdiFormatListNumbered,
  mdiFileChart
} from "@mdi/js";

export default {
  name: "NavigationDrawer",
  props: {
    drawer: {
      type: Boolean,
      default: false
    },
    mini: {
      type: Boolean,
      default: true
    },
    isMobile: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    icons: {
      mdiLock: mdiLock
    },
    links: [
      {
        text: "Home",
        to: { name: "c" },
        icon: mdiHome,
        loggedOut: true
      },
      {
        text: "Shifts",
        to: { name: "shiftList" },
        icon: mdiFormatListNumbered,
        loggedOut: false
      },
      {
        text: "Contracts",
        to: { name: "contractList" },
        icon: mdiFileDocument,
        loggedOut: false
      },
      {
        text: "Report",
        to: { name: "reportList" },
        icon: mdiFileChart,
        loggedOut: false
      },
      {
        text: "Password",
        to: { name: "changePassword" },
        icon: mdiTextboxPassword,
        loggedOut: false,
        withoutContract: true
      },
      {
        text: "Help",
        to: { name: "help" },
        icon: mdiHelp,
        loggedOut: true
      }
    ]
  }),
  computed: {
    name() {
      return this.user.first_name;
    },
    firstLetter() {
      if (this.name.length === 0) return "";

      return this.name.substring(0, 1);
    },
    visibleLinks() {
      if (this.isLoggedIn && this.selectedContract !== null) {
        return this.links;
      }

      if (this.selectedContract === null && this.isLoggedIn) {
        return this.links.filter(
          link => link.withoutContract === true || link.loggedOut === true
        );
      }

      return this.links.filter(link => link.loggedOut === true);
    },
    ...mapGetters({
      isLoggedIn: "auth/loggedIn",
      selectedContract: "selectedContract",
      user: "user"
    })
  }
};
</script>
