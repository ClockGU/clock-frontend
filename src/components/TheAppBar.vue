<template>
  <portal-target
    :slot-props="{ action: () => toggleNavigationdrawer() }"
    name="app-bar"
  >
    <v-app-bar app flat fixed>
      <v-app-bar-nav-icon
        class="hidden-md-and-up"
        @click="toggleNavigationdrawer"
      >
        <v-icon>{{ icons.mdiMenu }}</v-icon>
      </v-app-bar-nav-icon>

      <v-toolbar-title>
        <router-link to="/dashboard" tag="span" style="cursor: pointer">
          <v-img
            width="96px"
            height="32px"
            :src="require('@/assets/clock_full.svg')"
            contain
          />
        </router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-menu v-if="$vuetify.breakpoint.mdAndUp" offset-y>
        <template v-slot:activator="{ on }" class="ml-4">
          <div class="d-flex align-center" v-on="on">
            <v-avatar
              size="30px"
              color="blue lighten-2"
              class="ml-2"
              style="cursor: pointer"
            >
              <span class="white--text">J</span>
            </v-avatar>
            <div>
              <v-btn text class="pa-1">
                <span class="text-capitalize">John</span>
                <v-icon>{{ icons.mdiChevronDown }}</v-icon>
              </v-btn>
            </div>
          </div>
        </template>
        <v-list>
          <v-list-item
            v-for="item in menuItems"
            :key="item.text"
            :to="item.to"
            dense
            router
          >
            <v-list-item-action>
              <v-icon small>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>{{ item.text }} </v-list-item-content>
          </v-list-item>

          <v-list-item data-cy="menu-logout" @click="$emit('logout')">
            <v-list-item-action>
              <v-icon>{{ icons.mdiLock }}</v-icon>
            </v-list-item-action>

            <v-list-item-content>Logout</v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- <template v-if="showSelectContractButton">
        <v-btn
          data-cy="select-contract-button"
          text
          :to="{ path: '/select/' }"
          exact
        >
          {{ selectedContract.name }}
        </v-btn>
        <ClockInOutButton
          v-if="showClockInOutButton"
          :selected-contract="selectedContract"
          :clocked-shift="clockedShift"
        />
      </template> -->
    </v-app-bar>
  </portal-target>
</template>

<script>
// import ClockInOutButton from "@/components/ClockInOutButton";

import { mapGetters } from "vuex";

import {
  // mdiChevronLeft,
  // mdiChevronRight,
  mdiChevronDown,
  mdiMenu,
  mdiTextboxPassword,
  mdiHelp,
  mdiLock
} from "@mdi/js";

export default {
  name: "TheAppBar",
  components: {
    // ClockInOutButton
  },
  data: () => ({
    icons: {
      // mdiChevronLeft: mdiChevronLeft,
      // mdiChevronRight: mdiChevronRight,
      mdiMenu,
      mdiChevronDown,
      mdiLock
    },
    menuItems: [
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
    ...mapGetters({
      selectedContract: "selectedContract",
      clockedShift: "shift/clockedShift"
    }),
    showClockInOutButton() {
      return this.clockedShift !== undefined;
    },
    showSelectContractButton() {
      return this.selectedContract !== null;
    }
  },
  methods: {
    toggleNavigationdrawer() {
      this.$emit("toggle");
    }
  }
};
</script>
