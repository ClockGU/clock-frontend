<template>
  <base-layout
    alternative-portal-target="card-toolbar"
    :card-elevation="smAndDown ? 0 : null"
  >
    <template #card-top>
      <portal-target name="card-toolbar"></portal-target>
    </template>

    <template #pre-toolbar-title="{ action }">
      <v-app-bar-nav-icon
        v-if="smAndDown"
        icon
        @click="action"
      ></v-app-bar-nav-icon>
    </template>

    <template #title>
      {{ $t("app.settings") }}
    </template>

    <template #content>
      <v-tabs
        :direction="smAndUp && 'vertical'"
        class="tabs"
      >
        <v-tab>
          <v-icon start>{{ icons.mdiWeb }}</v-icon>
          {{ $t("app.language") }}
        </v-tab>

        <v-tab>
          <v-icon start>{{ icons.mdiFormatSection }}</v-icon>
          {{ $t("app.gdpr") }}
        </v-tab>

        <v-tab>
          <v-icon start>{{ icons.mdiBadgeAccountHorizontal }}</v-icon>
          {{ $t("personnelNumber.label") }}
        </v-tab>

        <v-tab>
          <v-icon start>{{ icons.mdiAccountRemove }}</v-icon>
          {{ $t("app.account") }}
        </v-tab>

        <v-tab v-if="isSuperUser">
          <v-icon start>{{ icons.mdiAccountReactivate }}</v-icon>
          Checkout User
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

        <v-tab-item>
          <AdminCheckoutUser :value="checkoutUserID" />
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
  mdiWeb,
  mdiAccountReactivate
} from "@mdi/js";

import DeleteAccount from "@/components/DeleteAccount.vue";
import GDPR from "@/components/gdpr/GdprSettingsCard.vue";
import PersonnelNumberForm from "@/components/PersonnelNumberForm.vue";
import LanguageSettings from "@/components/LanguageSettings.vue";
import AdminCheckoutUser from "@/components/AdminCheckoutUser.vue";
import { useDisplay } from "vuetify";

export default {
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
    }
  }),
  computed: {
    smAndDown() {
      const { smAndDown } = useDisplay();
      return smAndDown;
    },
    smAndUp() {
      const { smAndUp } = useDisplay();
      return smAndUp;
    },
    isSuperUser() {
      return this.$store.getters.user.is_superuser;
    },
    checkoutUserID() {
      return this.$store.getters["auth/checkoutUser"];
    }
  }
};
</script>

<style lang="scss" scoped>
div.tabs [role="tab"] {
  justify-content: flex-start;
}
</style>
<style lang="scss">
//not-so-beautiful hack
.v-slide-group__prev {
  display: none !important;
}
</style>
