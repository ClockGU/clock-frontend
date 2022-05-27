<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$vuetify.breakpoint.smAndDown"
    max-width="600"
    persistent
    no-click-animation
    @keydown.esc="closeDialog"
  >
    <v-card>
      <v-toolbar flat>
        <v-toolbar-title>
          {{ $t("app.privacyagreement") }}
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <LanguageSwitcher />

        <v-btn text @click="logout">
          {{ $t("actions.logout") }}
        </v-btn>
      </v-toolbar>

      <v-card-text class="pb-0">
        <i18n path="privacyagreement.text" tag="p">
          <template #privacyAgreement>
            <router-link :to="{ name: 'privacy' }">{{
              $t("app.privacyagreement")
            }}</router-link>
          </template>
        </i18n>

        <v-checkbox v-model="value" :label="$t('privacyagreement.checkbox')">
        </v-checkbox>
      </v-card-text>
      <v-card-text> {{ $t("privacyagreement.revokeInfo") }} </v-card-text>

      <v-card-actions>
        <v-btn text color="primary" :disabled="!value || loading" @click="save">
          {{ $t("actions.complete") }}
        </v-btn>
      </v-card-actions>

      <FeedbackMenu />
    </v-card>
  </v-dialog>
</template>

<script>
import { log } from "@/utils/log";
import { mdiDelete, mdiFileDocument, mdiClose, mdiRecord } from "@mdi/js";

import FeedbackMenu from "@/components/FeedbackMenu";

import AuthService from "@/services/auth";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default {
  name: "PrivacyDialog",
  components: { FeedbackMenu, LanguageSwitcher },
  data: () => ({
    value: false,
    confirmDialog: false,
    contractFormValid: false,
    dialog: true,
    icons: {
      mdiFileDocument,
      mdiDelete,
      mdiClose,
      mdiRecord
    },
    loading: false
  }),
  methods: {
    closeDialog() {
      this.$emit("close");
    },
    logout() {
      this.$store.dispatch("auth/LOGOUT");
    },
    async save() {
      this.loading = true;
      try {
        await AuthService.updateSettings({
          dsgvo_accepted: true
        });

        await this.$store.dispatch("GET_USER");

        this.$router
          .push({
            name: "dashboard"
          })
          .catch(() => {});
      } catch (error) {
        this.$store.dispatch("snackbar/setSnack", {
          snack: this.$t("snackbar.error"),
          timeout: 4000,
          color: "warning"
        });

        // TODO: Set error state
        log(error);
      } finally {
        setTimeout(() => {
          this.loading = false;
        }, 500);
      }
    }
  }
};
</script>
