<template>
  <portal-target
    :slot-props="{ action: () => toggleNavigationdrawer() }"
    name="app-bar"
  >
    <v-app-bar app flat fixed color="white">
      <v-app-bar-nav-icon
        v-if="isLoggedIn"
        class="hidden-md-and-up"
        @click="toggleNavigationdrawer"
      >
        <v-icon>{{ icons.mdiMenu }}</v-icon>
      </v-app-bar-nav-icon>

      <v-toolbar-title>
        <router-link :to="{ name: 'home' }" tag="span" style="cursor: pointer">
          <v-img
            width="96px"
            height="32px"
            :src="require('@/assets/clock_full.svg')"
            contain
          />
        </router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-skeleton-loader
        v-if="isLoggedIn && $vuetify.breakpoint.mdAndUp"
        :loading="userLoading"
        type="avatar"
      >
        <v-menu offset-y>
          <template v-slot:activator="{ on }" class="ml-4">
            <div class="d-flex align-center" v-on="on">
              <v-avatar
                size="30px"
                color="blue lighten-2"
                class="ml-2"
                style="cursor: pointer"
              >
                <span class="white--text">
                  {{ firstLetter }}
                </span>
              </v-avatar>
              <div>
                <v-btn text class="pa-1">
                  <span class="text-capitalize">{{ user.first_name }}</span>
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
              router
            >
              <v-list-item-content>{{ item.text }}</v-list-item-content>
            </v-list-item>

            <LogoutDialog>
              <template v-slot:activator="{ on }">
                <v-list-item data-cy="menu-logout" v-on="on">
                  <v-list-item-content>
                    {{ $t("actions.logout") }}
                  </v-list-item-content>
                </v-list-item>
              </template>
            </LogoutDialog>
          </v-list>
        </v-menu>
      </v-skeleton-loader>
    </v-app-bar>
  </portal-target>
</template>

<script>
import { mapGetters } from "vuex";

import { mdiChevronDown, mdiMenu } from "@mdi/js";

import LogoutDialog from "@/components/LogoutDialog";

export default {
  name: "TheAppBar",
  components: { LogoutDialog },
  data: () => ({
    icons: {
      mdiMenu,
      mdiChevronDown
    }
  }),
  computed: {
    ...mapGetters({
      selectedContract: "selectedContract",
      clockedShift: "shift/clockedShift",
      isLoggedIn: "auth/loggedIn",
      user: "user",
      userLoading: "userLoading"
    }),
    menuItems() {
      return [
        {
          text: this.$t("app.settings"),
          to: { name: "settings" },
          loggedOut: false,
          withoutContract: true
        },
        {
          text: this.$t("app.help"),
          to: { name: "help" },
          loggedOut: true
        }
      ];
    },
    firstLetter() {
      if (this.user === null) return "";

      return this.user.first_name.charAt(0);
    },
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
