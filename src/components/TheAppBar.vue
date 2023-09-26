<template>
  <portal-target
    :slot-props="{ action: () => toggleNavigationdrawer() }"
    name="app-bar"
  >
    <v-app-bar app flat fixed elevation="0" :color="bgColor">
      <v-app-bar-nav-icon
        v-if="isLoggedIn"
        class="hidden-md-and-up"
        @click="toggleNavigationdrawer"
      >
        <v-icon>{{ icons.mdiMenu }}</v-icon>
      </v-app-bar-nav-icon>

      <v-toolbar-title>
        <router-link :to="{ name: 'home' }" tag="span" style="cursor: pointer">
          <v-img width="96px" height="32px" :src="imgSrc" contain />
        </router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <ThemeToggle />

      <template v-if="showLoggedOutButtons">
        <LanguageSwitcher />

        <v-btn text :to="{ name: 'faq' }">{{ $t("app.faq") }}</v-btn>

        <ButtonGoetheOAuth text> Login </ButtonGoetheOAuth>
      </template>

      <v-skeleton-loader
        v-if="isLoggedIn && $vuetify.breakpoint.mdAndUp"
        :loading="userLoading"
        type="avatar"
      >
        <v-menu offset-y>
          <template #activator="{ on }" class="ml-4">
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
              <v-list-item-icon>
                <v-icon v-text="item.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>{{ item.text }}</v-list-item-content>
            </v-list-item>

            <LogoutDialog>
              <template #activator="{ on }">
                <v-list-item data-cy="menu-logout" v-on="on">
                  <v-list-item-icon>
                    <v-icon>{{ icons.mdiLogout }}</v-icon>
                  </v-list-item-icon>
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

import {
  mdiChevronDown,
  mdiMenu,
  mdiHelp,
  mdiAccountCog,
  mdiLogout
} from "@mdi/js";

import LogoutDialog from "@/components/LogoutDialog";
import ButtonGoetheOAuth from "@/components/ButtonGoetheOAuth";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";

export default {
  name: "TheAppBar",
  components: {
    ThemeToggle,
    LanguageSwitcher,
    ButtonGoetheOAuth,
    LogoutDialog
  },
  data: () => ({
    icons: {
      mdiMenu,
      mdiChevronDown,
      mdiLogout
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
      if (this.$vuetify.theme.dark) return "#121212";
      return "#FFFFFF";
    },
    imgSrc() {
      if (this.$vuetify.theme.dark)
        return require("@/assets/clock_full_darkmode.svg");
      return require("@/assets/clock_full.svg");
    }
  },
  methods: {
    toggleNavigationdrawer() {
      this.$emit("toggle");
    }
  }
};
</script>
