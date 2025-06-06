<template>
  <base-layout
    alternative-portal-target="card-toolbar"
    :card-elevation="isXs ? 0 : null"
  >
    <template #card-top>
      <portal-target name="card-toolbar"></portal-target>
    </template>

    <template #pre-toolbar-title="{ action }">
      <v-app-bar-nav-icon
        v-if="isXs"
        variant="flat"
        @click="action"
      ></v-app-bar-nav-icon>
    </template>

    <template #title>
      {{ $t("app.settings") }}
    </template>

    <template #content>
      <v-container>
        <div v-if="isXs">
          <v-window
            v-model="tab"
            direction="horizontal"
            show-arrows
            class="mb-4"
          >
            <template #prev="{ props }">
              <v-icon :icon="icons.mdiChevronLeft" v-bind="props"></v-icon>
            </template>
            <v-window-item
              v-for="(item, index) in tabs"
              :key="index"
              class="centered-item"
            >
              <v-icon class="mr-2 pr-1" :icon="item.icon" />
              {{ $t(item.text) }}
            </v-window-item>

            <template #next="{ props }">
              <v-icon :icon="icons.mdiChevronRight" v-bind="props"></v-icon>
            </template>
          </v-window>

          <v-window v-model="tab">
            <v-window-item
              v-for="(item, index) in tabs"
              :key="index"
              :value="item.value"
            >
              <component :is="item.component" />
            </v-window-item>
          </v-window>
        </div>

        <v-row v-else>
          <v-col cols="4">
            <v-tabs v-model="tab" direction="vertical" class="tabs">
              <v-tab v-for="(item, index) in tabs" :key="index">
                <v-icon :icon="item.icon" start />
                {{ $t(item.text) }}
              </v-tab>
            </v-tabs>
          </v-col>
          <v-col cols="8">
            <v-window v-model="tab">
              <v-window-item
                v-for="(item, index) in tabs"
                :key="index"
                :value="item.value"
              >
                <component :is="item.component" />
              </v-window-item>
            </v-window>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </base-layout>
</template>

<script>
import {
  mdiChevronLeft,
  mdiChevronRight,
  mdiFileAccount,
  mdiBadgeAccountHorizontal,
  mdiAccountRemove,
  mdiFormatSection,
  mdiWeb,
  mdiAccountReactivate
} from "@mdi/js";

import DeleteAccount from "@/components/DeleteAccount.vue";
import GDPR from "@/components/gdpr/GdprSettingsCard.vue";
import PersonnelNumberForm from "@/components/PersonnelNumberForm.vue";
import LanguageSettings from "@/components/LanguageSettings.vue";
import AdminCheckoutUser from "@/components/AdminCheckoutUser.vue";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Settings",
  metaInfo() {
    return {
      title: this.$t("app.settings")
    };
  },
  components: {
    DeleteAccount,
    GDPR,
    PersonnelNumberForm,
    LanguageSettings,
    AdminCheckoutUser
  },
  data: () => ({
    icons: {
      mdiFileAccount,
      mdiBadgeAccountHorizontal,
      mdiAccountRemove,
      mdiFormatSection,
      mdiWeb,
      mdiAccountReactivate
    },
    tab: "first"
  }),
  computed: {
    isXs() {
      return this.$vuetify.display.xs;
    },
    isSuperUser() {
      return this.$store.getters.user.is_superuser;
    },
    checkoutUserID() {
      return this.$store.getters["auth/checkoutUser"];
    },
    tabs() {
      let retValue = [
        {
          icon: mdiWeb,
          text: "app.language",
          value: "first",
          component: LanguageSettings
        },
        {
          icon: mdiFormatSection,
          text: "app.gdpr",
          value: "second",
          component: GDPR
        },
        {
          icon: mdiBadgeAccountHorizontal,
          text: "personnelNumber.label",
          value: "third",
          component: PersonnelNumberForm
        },
        {
          icon: mdiAccountRemove,
          text: "app.account",
          value: "fourth",
          component: DeleteAccount
        }
      ];
      if (this.isSuperUser) {
        retValue.push({
          icon: mdiAccountReactivate,
          text: "app.checkoutUser",
          value: "fifth",
          component: AdminCheckoutUser
        });
      }
      return retValue;
    }
  }
};
</script>

<style lang="scss" scoped>
div.tabs [role="tab"] {
  justify-content: flex-start;
}
.centered-item {
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}
</style>

<style lang="scss">
//not-so-beautiful hack
.v-slide-group__prev {
  display: none !important;
}
</style>
