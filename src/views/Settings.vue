<template>
  <base-layout
    alternative-portal-target="card-toolbar"
    col-classes="py-0"
    :card-elevation="$vuetify.breakpoint.smAndDown ? 0 : null"
  >
    <template v-slot:card-top>
      <portal-target name="card-toolbar"></portal-target>
    </template>

    <template v-slot:pre-toolbar-title="{ action }">
      <v-app-bar-nav-icon
        v-if="$vuetify.breakpoint.smAndDown"
        icon
        @click="action"
      ></v-app-bar-nav-icon>
    </template>

    <template v-slot:title>
      Settings
    </template>

    <template v-slot:content>
      <v-tabs :vertical="$vuetify.breakpoint.mdAndUp">
        <v-tab>
          <v-icon left>{{ icons.mdiTextboxPassword }}</v-icon>
          Password
        </v-tab>

        <v-tab>
          <v-icon left>{{ icons.mdiFileAccount }}</v-icon>
          GDPR
        </v-tab>

        <v-tab-item>
          <PasswordForm />
        </v-tab-item>

        <v-tab-item>
          <GDPR />
        </v-tab-item>
      </v-tabs>
    </template>
  </base-layout>
</template>

<script>
import { mdiFileAccount, mdiTextboxPassword } from "@mdi/js";

import PasswordForm from "@/components/PasswordForm";
import GDPR from "@/components/GDPR";

export default {
  name: "Settings",
  metaInfo() {
    return {
      title: this.$t("app.settings")
    };
  },
  components: { PasswordForm, GDPR },
  data: () => ({
    icons: { mdiFileAccount, mdiTextboxPassword }
  })
};
</script>
