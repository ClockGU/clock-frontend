<template>
  <v-navigation-drawer
    :model-value="drawer"
    app
    left
    disable-resize-watcher
    clipped
    @update:model-value="closeDrawer"
  >
    <v-row class="mt-4 mb-4" justify="center">
      <router-link v-slot="{ navigate }" :to="{ name: 'home' }" custom>
        <span role="link" style="cursor: pointer" @click="navigate" @keypress.enter="navigate">
          <v-img
            width="240px"
            height="36px"
            :src="logo"
          />
        </span>
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
        <template #activator="{ props }">
          <v-list-item v-bind="props">
            <template #prepend="prependProps">
              <v-avatar
                v-bind="prependProps"
                size="32px"
                color="blue-lighten-2"
                style="cursor: pointer"
              >
              <div class="text-white">
                {{ firstLetter }}
              </div>
              </v-avatar>
            </template>
            <p class="text-h6">
              {{ user.first_name }}
            </p>
          </v-list-item>
        </template>

        <v-list-item
          v-for="item in menuItems"
          :key="item.text"
          :to="item.to"
          style="--indent-padding: calc(var(--list-indent-size) - 12px)"
        >
          <template #prepend="prependProps">
            <v-icon :icon="item.icon" v-bind="prependProps">
            </v-icon>
          </template>
          <p style="padding-left: 4px">{{ item.text }}</p>
        </v-list-item>

        <LogoutDialog>
          <template #activator="{ props }">
            <v-list-item
              data-cy="menu-logout"
              :prepend-icon="icons.mdiLogout"
              v-bind="props"
              style="--indent-padding: calc(var(--list-indent-size) - 12px)"
            >
              <template #prepend="prependProps">
                <v-icon :icon="icons.mdiLogout" v-bind="prependProps">
                </v-icon>
              </template>
              <p style="padding-left: 4px">{{ $t("app.logout") }}</p>
            </v-list-item>
          </template>
        </LogoutDialog>
      </v-list-group>
    </v-list>

    <v-divider></v-divider>

    <v-list nav density="compact" data-cy="menu-list">
      <v-list-item v-for="link in links" :key="link.text" :prepend-icon="link.icon" :to="link.to">
        <p>{{ link.text }}</p>
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
    },
    imgSrc() {
      if (this.$vuetify.theme.dark)
        return require("@/assets/clock_full_darkmode.svg");
      return require("@/assets/clock_full.svg");
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
