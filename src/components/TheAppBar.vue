<template>
  <portal-target
    :slot-props="{ action: () => toggleNavigationdrawer() }"
    name="app-bar"
  >
    <v-app-bar app flat fixed elevation="0" :color="bgColor">
      <v-app-bar-nav-icon
        v-if="isLoggedIn"
        role="button"
        type="button"
        aria-haspopup="dialog"
        :aria-label="$t('label.dashboard.toggleNavigationdrawer')"
        class="hidden-md-and-up"
        @click="toggleNavigationdrawer"
      />

      <v-toolbar-title
        style="width: fit-content; flex: none; display: inline-block"
      >
        <RouterLink
          class="nav-link"
          role="link"
          type="link"
          :aria-label="$t('label.dashboard.toDashboard')"
          :to="{ name: 'home' }"
        >
          <v-img width="96px" height="32px" :src="imgSrc" alt="CLOCK Logo" />
        </RouterLink>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <ThemeToggle />

      <template v-if="showLoggedOutButtons">
        <LanguageSwitcher />

        <v-btn variant="text" :to="{ name: 'faq' }">{{ $t("app.faq") }}</v-btn>

        <ButtonGoetheOAuth text> Login </ButtonGoetheOAuth>
      </template>

      <v-skeleton-loader
        v-if="isLoggedIn && mdAndUp"
        :loading="userLoading"
        type="avatar"
      >
        <v-menu aria-activedescendant="true" class="py-3">
          <template #activator="{ props }">
            <v-btn
              aria-labelledby="settings-menu-content"
              type="button"
              :color="bgColor"
              variant="flat"
              v-bind="props"
            >
              <div class="d-flex align-center">
                <v-avatar
                  aria-hidden="true"
                  size="30px"
                  color="blue-lighten-2"
                  style="cursor: pointer"
                  class="mr-2"
                >
                  <span class="text-white">
                    {{ firstLetter }}
                  </span>
                </v-avatar>
                <div id="settings-menu-content">
                  <span class="text-capitalize">
                    {{ user.first_name }}
                  </span>
                  <span class="sr-only">
                    {{ $t("label.dashboard.userMenu") }}</span
                  >
                </div>
              </div>
              <v-icon :icon="icons.mdiChevronDown"></v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="item in menuItems"
              :key="item.text"
              :prepend-icon="item.icon"
              :to="item.to"
              router
            >
              <v-list-item-title> {{ item.text }} </v-list-item-title>
            </v-list-item>
            <v-list-item
              :key="$t('actions.logout')"
              :aria-label="$t('actions.logout')"
              :prepend-icon="icons.mdiLogout"
              aria-haspopup="dialog"
              role="button"
              type="button"
              @click="dialog = !dialog"
              @keydown.enter="dialog = !dialog"
              @keydown.space="dialog = !dialog"
            >
              <v-list-item-title>
                {{ $t("actions.logout") }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-skeleton-loader>
    </v-app-bar>
    <LogoutDialog v-model="dialog" />
  </portal-target>
</template>

<script>
import { mapGetters } from "vuex";
import svg from "@/assets/clock_full.svg";
import darkSvg from "@/assets/clock_full_darkmode.svg";

import {
  mdiChevronDown,
  mdiMenu,
  mdiHelp,
  mdiAccountCog,
  mdiLogout
} from "@mdi/js";

import ThemeToggle from "@/components/ThemeToggle.vue";
import LogoutDialog from "@/components/LogoutDialog.vue";
import ButtonGoetheOAuth from "@/components/ButtonGoetheOAuth.vue";
import LanguageSwitcher from "@/components/LanguageSwitcher.vue";

export default {
  name: "TheAppBar",
  components: {
    ThemeToggle,
    LanguageSwitcher,
    ButtonGoetheOAuth,
    LogoutDialog
  },
  emits: ["toggle"],
  data: () => ({
    icons: {
      mdiMenu,
      mdiChevronDown,
      mdiLogout
    },
    dialog: false
  }),
  computed: {
    ...mapGetters({
      selectedContract: "selectedContract",
      clockedShift: "shift/clockedShift",
      isLoggedIn: "auth/loggedIn",
      user: "user",
      userLoading: "userLoading"
    }),
    logo() {
      return svg;
    },
    mdAndUp() {
      return this.$vuetify.display.mdAndUp;
    },
    showLoggedOutButtons() {
      return !this.isLoggedIn && this.$route.name !== "loggingIn";
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
    firstLetter() {
      if (this.user === null) return "";

      return this.user.first_name.charAt(0);
    },
    showSelectContractButton() {
      return this.selectedContract !== null;
    },
    bgColor() {
      if (this.$vuetify.theme.name === "dark") return "#121212";
      return "#FFFFFF";
    },
    imgSrc() {
      if (this.$vuetify.theme.name === "dark") return darkSvg;
      return svg;
    }
  },
  methods: {
    toggleNavigationdrawer() {
      console.log("Toggle triggered");
      this.$emit("toggle");
    }
  }
};
</script>
<style>
.nav-link {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
}
.nav-link > span:focus {
  outline: red;
}
</style>
