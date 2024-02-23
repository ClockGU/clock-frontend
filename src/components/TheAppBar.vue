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
        <router-link v-slot="{ navigate }" :to="{ name: 'home' }" custom>
          <span role="link" style="cursor: pointer" @click="navigate" @keypress.enter="navigate">
          <v-img
            width="96px"
            height="32px"
            :src="imgSrc"
          />
          </span>
        </router-link>
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
        <v-menu class="py-3">
          <template #activator="{ props }">
            <v-btn :color="bgColor" variant="flat">
            <div class="d-flex align-center" v-bind="props">
              <v-avatar
                size="30px"
                color="blue-lighten-2"
                style="cursor: pointer"
                class="mr-2"
              >
                <span class="text-white">
                  {{ firstLetter }}
                </span>
              </v-avatar>
              <span class="text-capitalize">{{ user.first_name }}</span>
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
              {{ item.text }}
            </v-list-item>

            <LogoutDialog>
              <template #activator="{ props }">
                <v-list-item :prepend-icon="icons.mdiLogout" data-cy="menu-logout" v-bind="props">
                  {{ $t("actions.logout") }}
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
import svg from '@/assets/clock_full.svg';
import darkSvg from '@/assets/clock_full_darkmode.svg'

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
import { useDisplay } from "vuetify";

export default {
  name: "TheAppBar",
  components: {
    ThemeToggle,
    LanguageSwitcher,
    ButtonGoetheOAuth,
    LogoutDialog
  },
  emits:["toggle"],
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
    logo() {
      return svg;
    },
    mdAndUp() {
      return useDisplay().mdAndUp;
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
      if (this.$vuetify.theme.name === "dark")
        return darkSvg;
      return svg;
    }
  },
  methods: {
    toggleNavigationdrawer() {
      this.$emit("toggle");
    }
  }
};
</script>
