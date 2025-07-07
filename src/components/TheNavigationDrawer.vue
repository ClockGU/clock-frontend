<template>
  <v-navigation-drawer
    :model-value="drawer"
    role="dialog"
    aria-modal="true"
    left
    disable-resize-watcher
    temporary
    @update:model-value="closeDrawer"
  >
    <v-list
      id="first-item"
      :aria-label="$t('aria.dashboard.navDrawer')"
      role="menu"
    >
      <v-list-item>
        <RouterLink
          style="display: inline-flex"
          role="link"
          type="link"
          :to="{ name: 'home' }"
        >
          <v-img width="240px" height="36px" :src="imgSrc" />
          <h1 class="sr-only">CLOCK</h1>
        </RouterLink>
        <v-divider></v-divider>
      </v-list-item>
      <v-list-item>
        <v-list-group no-action>
          <template #activator="{ props }">
            <v-list-item v-bind="props">
              <template #prepend="prependProps">
                <v-avatar
                  aria-hidden="true"
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
              <span class="sr-only"> {{ $t("aria.dashboard.userMenu") }}</span>
            </v-list-item>
          </template>

          <v-list-item
            v-for="item in menuItems"
            :key="item.text"
            :to="item.to"
            style="--indent-padding: calc(var(--list-indent-size) - 12px)"
          >
            <template #prepend="prependProps">
              <v-icon :icon="item.icon" v-bind="prependProps"></v-icon>
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
                  <v-icon
                    :icon="icons.mdiLogout"
                    v-bind="prependProps"
                  ></v-icon>
                </template>
                <p style="padding-left: 4px">{{ $t("app.logout") }}</p>
              </v-list-item>
            </template>
          </LogoutDialog>
        </v-list-group>
        <v-divider></v-divider>
      </v-list-item>
      <v-list-item
        v-for="link in links"
        :key="link.text"
        :prepend-icon="link.icon"
        :to="link.to"
      >
        <p>{{ link.text }}</p>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from "vuex";
import svg from "@/assets/clock_full.svg";
import darkSvg from "@/assets/clock_full_darkmode.svg";

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
  emits: ["closeDrawer"],
  data: () => ({
    icons: {
      mdiLock,
      mdiLogout
    },
    scrollLock: undefined
  }),
  computed: {
    ...mapGetters({
      isLoggedIn: "auth/loggedIn",
      user: "user",
      userLoading: "userLoading"
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
            name: "calendar"
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
      if (this.$vuetify.theme.name === "dark") return darkSvg;
      return svg;
    }
  },
  watch: {
    drawer(value) {
      if (value) {
        document.documentElement.style.overflow = "hidden";
        document.getElementById("first-item").focus();
      } else {
        document.documentElement.style.overflow = "auto";
      }
    }
  },
  mounted() {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && this.drawer) {
        this.closeDrawer(false);
      }
    });
  },
  beforeUnmount() {
    document.removeEventListener("keydown", (event) => {
      if (event.key === "Escape" && this.drawer) {
        this.closeDrawer(false);
      }
    });
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

<style scoped>
::v-deep .v-list-item {
  tab-index: -2;qqq
}
</style>
