<template>
  <base-layout
    alternative-portal-target="card-toolbar"
    :card-elevation="isXs ? 0 : null"
    aria-labelledby="settings-title"
  >
    <template #card-top>
      <portal-target name="card-toolbar"></portal-target>
    </template>

    <template #pre-toolbar-title="{ action }">
      <v-app-bar-nav-icon
        v-if="isXs"
        variant="flat"
        @click="action"
        :aria-label="$t('aria.openNavigation')"
      ></v-app-bar-nav-icon>
    </template>

    <template #title>
      <h2 id="settings-title" class="text-h5 font-weight-bold">
        {{ $t("app.settings") }}
      </h2>
    </template>

    <template #content>
      <v-container>
        <div v-if="isXs">
          <v-window
            v-model="tab"
            direction="horizontal"
            show-arrows
            class="mb-4"
            role="tablist"
          >
            <template #prev="{ props }">
              <v-icon
                :icon="icons.mdiChevronLeft"
                v-bind="props"
                :aria-label="$t('aria.previousTab')"
              ></v-icon>
            </template>
            <v-window-item
              v-for="(item, index) in tabs"
              :key="index"
              class="centered-item"
              role="tab"
              :aria-selected="tab === item.value"
              :aria-controls="'panel-' + item.value"
              @click="tab = item.value"
              :tabindex="tab === item.value ? 0 : -1"
            >
              <v-icon class="mr-2 pr-1" :icon="item.icon" />
              {{ $t(item.text) }}
            </v-window-item>

            <template #next="{ props }">
              <v-icon
                :icon="icons.mdiChevronRight"
                v-bind="props"
                :aria-label="$t('aria.nextTab')"
              ></v-icon>
            </template>
          </v-window>

          <v-window v-model="tab">
            <v-window-item
              v-for="(item, index) in tabs"
              :key="index"
              :value="item.value"
              role="tabpanel"
              :id="'panel-' + item.value"
              :aria-labelledby="'tab-' + item.value"
            >
              <component :is="item.component" />
            </v-window-item>
          </v-window>
        </div>

        <v-row v-else>
          <v-col cols="4">
            <v-tabs
              v-model="tab"
              direction="vertical"
              class="tabs"
              :aria-label="$t('aria.settings.tabs')"
              role="tablist"
            >
              <v-tab
                v-for="(item, index) in tabs"
                :key="index"
                :value="item.value"
                :aria-controls="'panel-' + item.value"
                :tabindex="tab === item.value ? 0 : -1"
              >
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
                role="tabpanel"
                :id="'panel-' + item.value"
                :aria-labelledby="'tab-' + item.value"
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
  mdiAccountReactivate,
  mdiTimerOutline
} from "@mdi/js";

import DeleteAccount from "@/components/settings/DeleteAccount.vue";
import GDPR from "@/components/gdpr/GdprSettingsCard.vue";
import PersonnelNumberForm from "@/components/settings/PersonnelNumberForm.vue";
import LanguageSettings from "@/components/settings/LanguageSettings.vue";
import AdminCheckoutUser from "@/components/settings/AdminCheckoutUser.vue";
import SnackBarSettings from "@/components/settings/SnackBarSettings.vue";

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
    AdminCheckoutUser,
    SnackBarSettings
  },
  data: () => ({
    icons: {
      mdiFileAccount,
      mdiBadgeAccountHorizontal,
      mdiAccountRemove,
      mdiFormatSection,
      mdiWeb,
      mdiAccountReactivate,
      mdiChevronLeft,
      mdiChevronRight,
      mdiTimerOutline
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
          icon: mdiTimerOutline,
          text: "settings.snackbar.title",
          value: "second",
          component: SnackBarSettings
        },
        {
          icon: mdiFormatSection,
          text: "app.gdpr",
          value: "third",
          component: GDPR
        },
        {
          icon: mdiBadgeAccountHorizontal,
          text: "personnelNumber.label",
          value: "fourth",
          component: PersonnelNumberForm
        },
        {
          icon: mdiAccountRemove,
          text: "app.account",
          value: "fifth",
          component: DeleteAccount
        }
      ];
      if (this.isSuperUser) {
        retValue.push({
          icon: mdiAccountReactivate,
          text: "app.checkoutUser",
          value: "sixth",
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
//not-so-beautiful hack
.v-slide-group__prev {
  display: none !important;
}
</style>
