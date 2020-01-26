<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    left
    class="grey lighten-4"
    disable-resize-watcher
    clipped
    @input="closeDrawer"
  >
    <v-list data-cy="menu-list">
      <v-list-item v-for="link in visibleLinks" :key="link.text" :to="link.to">
        <v-list-item-action>
          <v-icon>{{ link.icon }}</v-icon>
        </v-list-item-action>

        <v-list-item-content>{{ link.text }}</v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from "vuex";

import {
  mdiCalendar,
  mdiHome,
  mdiFileDocument,
  mdiLock,
  mdiFormatListNumbered,
  mdiFileChart
} from "@mdi/js";

export default {
  name: "NavigationDrawer",
  props: {
    drawer: {
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
        text: "Dashboard",
        to: { name: "dashboard" },
        icon: mdiHome,
        loggedOut: false
      },
      {
        text: "Calendar",
        to: {
          name: "calendar",
          params: { type: "month", year: 2020, month: 1, day: 1 }
        },
        icon: mdiCalendar,
        loggedOut: false
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
      }
    ]
  }),
  computed: {
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
      selectedContract: "selectedContract"
    })
  },
  methods: {
    closeDrawer(value) {
      if (!value) {
        this.$emit("closeDrawer");
      }
    }
  }
};
</script>
