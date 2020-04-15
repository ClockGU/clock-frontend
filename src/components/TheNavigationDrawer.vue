<template>
  <v-navigation-drawer
    :value="drawer"
    app
    left
    class="grey lighten-4"
    disable-resize-watcher
    clipped
    @input="closeDrawer"
  >
    <v-row class="mt-4 mb-4" justify="center">
      <router-link to="/dashboard" tag="span" style="cursor: pointer">
        <v-img
          width="240px"
          height="36px"
          :src="require('@/assets/clock_full.svg')"
          contain
        />
      </router-link>
    </v-row>

    <v-divider></v-divider>

    <v-skeleton-loader
      v-if="isLoggedIn && userLoading"
      :loading="userLoading"
      type="heading"
      width="300px"
      class="pl-2 py-3"
    >
    </v-skeleton-loader>
    <v-list v-else>
      <v-list-group no-action>
        <template v-slot:activator>
          <v-list-item-avatar>
            <v-avatar
              size="32px"
              color="blue lighten-2"
              style="cursor: pointer"
            >
              <span class="white--text">
                {{ firstLetter }}
              </span>
            </v-avatar>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title class="title">
              {{ user.first_name }}
            </v-list-item-title>
          </v-list-item-content>
        </template>

        <v-list-item v-for="item in menuItems" :key="item.text" :to="item.to">
          <v-list-item-content>
            <v-list-item-title>{{ item.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <LogoutDialog>
          <template v-slot:activator="{ on }">
            <v-list-item data-cy="menu-logout" v-on="on">
              <v-list-item-content>
                <v-list-item-title>Logout</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </LogoutDialog>
      </v-list-group>
    </v-list>

    <v-divider></v-divider>

    <v-list nav dense data-cy="menu-list">
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
import { getRouterProps } from "@/utils/date";
import { mapGetters } from "vuex";

import LogoutDialog from "@/components/LogoutDialog";

import {
  mdiCalendar,
  mdiHome,
  mdiFileDocument,
  mdiLock,
  mdiFormatListNumbered,
  mdiFileChart,
  mdiTextboxPassword,
  mdiHelp
} from "@mdi/js";

export default {
  name: "NavigationDrawer",
  components: { LogoutDialog },
  props: {
    drawer: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    icons: {
      mdiLock
    },
    menuItems: [
      {
        text: "Select contract",
        to: { name: "contractSelect" },
        icon: mdiFileDocument
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
    ],
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
          params: { ...getRouterProps("month", new Date()) }
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
    firstLetter() {
      if (this.user === null) return "";

      return this.user.first_name.charAt(0);
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
      user: "user",
      userLoading: "userLoading"
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
