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

    <v-list v-if="isLoggedIn">
      <v-list-group no-action>
        <template v-slot:activator>
          <v-list-item-avatar>
            <v-img
              src="https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortWaved&accessoriesType=Prescription01&hairColor=BrownDark&facialHairType=MoustacheFancy&facialHairColor=Auburn&clotheType=ShirtVNeck&clotheColor=PastelBlue&eyeType=Squint&eyebrowType=SadConcerned&mouthType=Eating&skinColor=Brown"
            ></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title class="title">John Doe</v-list-item-title>
          </v-list-item-content>
        </template>

        <v-list-item v-for="item in menuItems" :key="item.text" :to="item.to">
          <v-list-item-content>
            <v-list-item-title>{{ item.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item data-cy="menu-logout" @click="$emit('logout')">
          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
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
import { mapGetters } from "vuex";

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
