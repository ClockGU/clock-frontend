<template>
  <v-navigation-drawer
    :model-value="drawer"
    app
    left
    class="bg-grey-lighten-4"
    disable-resize-watcher
    clipped
    @update:model-value="closeDrawer"
  >
    <v-row class="mt-4 mb-4" justify="center">
      <router-link to="/dashboard" tag="span" style="cursor: pointer">
        <v-img
          width="240px"
          height="36px"
          :src="logo"
          cover
        />
      </router-link>
    </v-row>

    <v-divider></v-divider>

    <VSkeletonLoader
      v-if="isLoggedIn && userLoading"
      :loading="userLoading"
      type="heading"
      width="300px"
      class="pl-2 py-3"
    >
    </VSkeletonLoader>
    <v-list v-else>
      <v-list-group no-action>
        <template #activator>
          <v-list-item>
            <v-avatar
              size="32px"
              color="blue-lighten-2"
              style="cursor: pointer"
            >
              <span class="text-white">
                {{ firstLetter }}
              </span>
            </v-avatar>
            <v-list-item-title class="text-h6">
              {{ user.first_name }}
            </v-list-item-title>
          </v-list-item>
        </template>

        <v-list-item
          v-for="item in menuItems"
          :key="item.text"
          :to="item.to"
          class="pl-5"
          :prepend-icon="item.icon"
        >
          <v-list-item-title>{{ item.text }}</v-list-item-title>
        </v-list-item>

        <LogoutDialog>
          <template #activator="{ on }">
            <v-list-item data-cy="menu-logout" class="pl-5" :prepend-icon="icons.mdiLogout" v-on="on">
              <v-list-item-title>{{ $t("app.logout") }}</v-list-item-title>
            </v-list-item>
          </template>
        </LogoutDialog>
      </v-list-group>
    </v-list>

    <v-divider></v-divider>

    <v-list nav density="compact" data-cy="menu-list">
      <v-list-item v-for="link in links" :key="link.text" :to="link.to">
        <v-list-item-action>
          <v-icon>{{ link.icon }}</v-icon>
        </v-list-item-action>

        {{ link.text }}
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { getRouterProps } from "@/utils/date";
import { mapGetters } from "vuex";
import svg from "@/assets/clock_full.svg"

import LogoutDialog from "@/components/LogoutDialog.vue";

import {
  mdiAccountCog,
  mdiCalendar,
  mdiHome,
  mdiFileDocument,
  mdiLock,
  mdiFormatListNumbered,
  mdiFileChart,
  mdiHelp,
  mdiLogout
} from "@mdi/js";
import { VSkeletonLoader } from "vuetify/labs/components";

export default {
  name: "NavigationDrawer",
  components: { LogoutDialog, VSkeletonLoader },
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
      userLoading: "userLoading"
    }),
    logo(){
      return svg;
    },
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
        }
      ];
    },
    links() {
      return [
        {
          text: this.$t("app.dashboard"),
          to: {
            name: "dashboard"
          },
          icon: mdiHome,
          loggedOut: false
        },
        {
          text: this.$t("app.calendar"),
          to: {
            name: "calendar",
            params: {
              ...getRouterProps("month", new Date())
            }
          },
          icon: mdiCalendar,
          loggedOut: false
        },
        {
          text: this.$t("app.shifts"),
          to: {
            name: "shiftList"
          },
          icon: mdiFormatListNumbered,
          loggedOut: false
        },
        {
          text: this.$t("app.contracts"),
          to: {
            name: "contractList"
          },
          icon: mdiFileDocument,
          loggedOut: false
        },
        {
          text: this.$t("app.reports"),
          to: {
            name: "reporting"
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
