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
        variant="flat"
        @click="action"
      ></v-app-bar-nav-icon>
    </template>

    <template #title>
      {{ $t("app.settings") }}
    </template>

    <template #content>
      <v-container>
        <v-row>
          <v-col cols="4">
            <v-tabs
              v-model="tab"
              :direction="smAndUp ? 'vertical' : 'horizontal'"
              class="tabs"
            >
              <v-tab>
                <v-icon :icon="icons.mdiWeb" start />
                {{ $t("app.language") }}
              </v-tab>

              <v-tab>
                <v-icon :icon="icons.mdiFormatSection" start />
                {{ $t("app.gdpr") }}
              </v-tab>

              <v-tab>
                <v-icon :icon="icons.mdiBadgeAccountHorizontal" start />
                {{ $t("personnelNumber.label") }}
              </v-tab>

              <v-tab>
                <v-icon :icon="icons.mdiAccountRemove" start />
                {{ $t("app.account") }}
              </v-tab>

              <v-tab v-if="isSuperUser">
                <v-icon :icon="icons.mdiAccountReactivate" start />
                Checkout User
              </v-tab>
            </v-tabs>
          </v-col>
          <v-col cols="8">
            <v-window v-model="tab">
              <v-window-item value="first">
                <LanguageSettings />
              </v-window-item>

              <v-window-item value="second">
                <GDPR />
              </v-window-item>

              <v-window-item value="third">
                <PersonnelNumberForm />
              </v-window-item>

              <v-window-item value="fourth">
                <DeleteAccount />
              </v-window-item>

              <v-window-item value="fifth">
                <AdminCheckoutUser :value="checkoutUserID" />
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
    smAndDown() {
      return this.$vuetify.display.smAndDown;
    },
    smAndUp() {
      return this.$vuetify.display.smAndUp;
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
