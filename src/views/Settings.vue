<template>
  <base-layout
    alternative-portal-target="card-toolbar"
    :card-elevation="$vuetify.breakpoint.smAndDown ? 0 : null"
  >
    <template #card-top>
      <portal-target name="card-toolbar"></portal-target>
    </template>

    <template #pre-toolbar-title="{ action }">
      <v-app-bar-nav-icon
        v-if="$vuetify.breakpoint.smAndDown"
        icon
        @click="action"
      ></v-app-bar-nav-icon>
    </template>

    <template #title>
      {{ $t("app.settings") }}
    </template>

    <template #content>
      <v-tabs vertical class="tabs">
        <v-tab>
          <v-icon left>{{ icons.mdiWeb }}</v-icon>
          {{ $t("app.language") }}
        </v-tab>

        <v-tab>
          <v-icon left>{{ icons.mdiFormatSection }}</v-icon>
          {{ $t("app.gdpr") }}
        </v-tab>

        <v-tab>
          <v-icon left>{{ icons.mdiBadgeAccountHorizontal }}</v-icon>
          {{ $t("onboarding.personnelNumber.label") }}
        </v-tab>

        <v-tab>
          <v-icon left>{{ icons.mdiAccountRemove }}</v-icon>
          {{ $t("app.account") }}
        </v-tab>

        <v-tab-item>
          <LanguageSettings />
        </v-tab-item>

        <v-tab-item>
          <GDPR />
        </v-tab-item>

        <v-tab-item>
          <PersonnelNumberForm />
        </v-tab-item>

        <v-tab-item>
          <DeleteAccount />
        </v-tab-item>
      </v-tabs>
    </template>
  </base-layout>
</template>

<script>
import {
  mdiFileAccount,
  mdiBadgeAccountHorizontal,
  mdiAccountRemove,
  mdiFormatSection,
  mdiWeb
} from "@mdi/js";

import DeleteAccount from "@/components/DeleteAccount";
import GDPR from "@/components/GDPR";
import PersonnelNumberForm from "@/components/PersonnelNumberForm";
import LanguageSettings from "@/components/LanguageSettings";

export default {
  name: "Settings",
  metaInfo() {
    return {
      title: this.$t("app.settings")
    };
  },
  components: { DeleteAccount, GDPR, PersonnelNumberForm, LanguageSettings },
  data: () => ({
    icons: {
      mdiFileAccount,
      mdiBadgeAccountHorizontal,
      mdiAccountRemove,
      mdiFormatSection,
      mdiWeb
    }
  })
};
</script>

<style lang="scss" scoped>
div.tabs [role="tab"] {
  justify-content: flex-start;
}
</style>
