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
        <template #activator>
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
            <v-list-item-title class="text-h6">
              {{ user.first_name }}
            </v-list-item-title>
          </v-list-item-content>
        </template>

        <v-list-item
          v-for="item in menuItems"
          :key="item.text"
          :to="item.to"
          class="pl-5"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <LogoutDialog>
          <template #activator="{ on }">
            <v-list-item data-cy="menu-logout" class="pl-5" v-on="on">
              <v-list-item-icon>
                <v-icon v-text="icons.mdiLogout"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ $t("app.logout") }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </LogoutDialog>
      </v-list-group>
    </v-list>

    <v-divider></v-divider>

    <v-list nav dense data-cy="menu-list">
      <v-list-item v-for="link in links" :key="link.text" :to="link.to">
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
  mdiAccountCog,
  mdiCalendar,
  mdiHome,
  mdiFileDocument,
  mdiLock,
  mdiFormatListNumbered,
  mdiFileChart,
  mdiHelp,
  mdiBackupRestore,
  mdiLogout
} from "@mdi/js";

export default {
  name: "NavigationDrawer",
  components: { LogoutDialog },
  props: {
    drawer: {
      type: Boolean,
      default: false
    },
    selectedContract: {
      type: String,
      default: ""
    }
  },
  data: () => ({
    icons: {
      mdiLock,
      mdiLogout
    }
  }),
  computed: {
    ...mapGetters({
      isLoggedIn: "auth/loggedIn",
      user: "user",
      userLoading: "userLoading",
      selectedContract: "contract/selectedContract"
    }),
    firstLetter() {
      if (this.user === null) return "";

      return this.user.first_name.charAt(0);
    },
    menuItems() {
      return [
        {
          text: this.$t("app.settings"),
          to: { name: "settings" },
          icon: mdiAccountCog,
          loggedOut: false,
          withoutContract: true
        },
        {
          text: "FAQ",
          to: { name: "faq" },
          icon: mdiHelp,
          loggedOut: true
        },
        {
          text: this.$t("app.reset"),
          to: { name: "help" },
          icon: mdiBackupRestore,
          loggedOut: true
        }
      ];
    },
    links() {
      return [
        {
          text: this.$t("app.dashboard"),
          to: {
            name: "dashboard",
            params: { contract: this.selectedContract }
          },
          icon: mdiHome,
          loggedOut: false
        },
        {
          text: this.$t("app.calendar"),
          to: {
            name: "calendar",
            params: {
              ...getRouterProps("month", new Date()),
              contract: this.selectedContract
            }
          },
          icon: mdiCalendar,
          loggedOut: false
        },
        {
          text: this.$t("app.shifts"),
          to: {
            name: "shiftList",
            params: { contract: this.selectedContract }
          },
          icon: mdiFormatListNumbered,
          loggedOut: false
        },
        {
          text: this.$t("app.contracts"),
          to: {
            name: "contractList",
            params: { contract: this.selectedContract }
          },
          icon: mdiFileDocument,
          loggedOut: false
        },
        {
          text: this.$t("app.reports"),
          to: {
            name: "reporting",
            params: { contract: this.selectedContract }
          },
          icon: mdiFileChart,
          loggedOut: false
        }
      ];
    }
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
