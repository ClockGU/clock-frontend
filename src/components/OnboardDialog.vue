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
          {{ titles[step] }}
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <LanguageSwitcher />

        <v-btn text @click="logout">
          {{ $t("actions.logout") }}
        </v-btn>
      </v-toolbar>

      <v-card-text class="pb-0">
        <v-window v-model="step">
          <v-window-item :value="0">
            <placeholder name="UndrawSubway">
              {{ $t("onboarding.welcome.text") }}
            </placeholder>
          </v-window-item>

          <v-window-item :value="1">
            <placeholder name="UndrawWorkInProgress">
              {{ $t("onboarding.underConstruction.text") }}
            </placeholder>
          </v-window-item>

          <v-window-item :value="2">
            <p>{{ $t("onboarding.createContract.text") }}</p>
            <ContractForm :entity="entity" @update="updateContractForm" />
          </v-window-item>

          <v-window-item :value="3">
            <placeholder name="UndrawFinishLine">
              {{ $t("onboarding.finished.text") }}
            </placeholder>
          </v-window-item>
        </v-window>
      </v-card-text>

      <v-card-actions>
        <v-btn :disabled="step == 0" text @click="step--">
          {{ $t("actions.back") }}
        </v-btn>
        <v-spacer></v-spacer>

        <v-item-group v-model="step" class="text-center" mandatory>
          <v-item
            v-for="n in titles.length"
            :key="`btn-${n}`"
            v-slot:default="{ active, toggle }"
          >
            <v-btn :input-value="active" icon @click="toggle">
              <v-icon>{{ icons.mdiRecord }}</v-icon>
            </v-btn>
          </v-item>
        </v-item-group>

        <v-spacer></v-spacer>
        <v-btn
          v-if="step != titles.length - 1"
          :disabled="step == 2 && !contractFormValid"
          color="primary"
          text
          @click="step++"
        >
          {{ $t("actions.next") }}
        </v-btn>
        <v-btn v-else text color="primary" :loading="loading" @click="save">
          {{ $t("actions.complete") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { handleApiError } from "@/utils/interceptors";
import { mdiDelete, mdiClose, mdiRecord } from "@mdi/js";

import ContractForm from "@/components/contracts/ContractForm";

import { ServiceFactory } from "@/factories/serviceFactory";

import LanguageSwitcher from "@/components/LanguageSwitcher";

export default {
  name: "OnboardDialog",
  components: { ContractForm, LanguageSwitcher },
  props: {
    now: {
      type: Date,
      default: () => new Date()
    },
    entity: {
      type: Object || null,
      default: null
    },
    entityName: {
      type: String,
      default: "contract"
    }
  },
  data: () => ({
    step: 0,
    confirmDialog: false,
    contractFormValid: false,
    dialog: true,
    icons: {
      mdiDelete,
      mdiClose,
      mdiRecord
    },
    contractToSave: null,
    toSave: null,
    service: null,
    loading: false
  }),
  computed: {
    serviceRepository() {
      return ServiceFactory.get(this.entityName);
    },
    titles() {
      return [
        this.$t("onboarding.welcome.title"),
        this.$t("onboarding.underConstruction.title"),
        this.$t("onboarding.createContract.title", {
          entity: this.$tc("models.contract")
        }),
        this.$t("onboarding.finished.title")
      ];
    }
  },
  created() {
    // Load the entity service
    this.loadService();
    // Make a copy of the entity we will save.
    this.toSave = this.entity;
  },
  methods: {
    updateContractForm(event) {
      this.contractToSave = event[this.entityName];
      this.contractFormValid = event.valid;
    },
    loadService() {
      this.serviceRepository.serviceLoader().then(service => {
        this.service = service["default"];
      });
    },
    closeDialog() {
      this.$emit("close");
    },
    logout() {
      this.$store.dispatch("auth/LOGOUT");
    },
    save() {
      this.loading = true;
      this.service
        .create(this.contractToSave.toPayload())
        .then(response => {
          const { uuid: contract } = response;

          this.$router.push({ name: "dashboard", params: { contract } });
        })
        .then(() => {
          return this.$store.dispatch("contract/queryContracts");
        })
        .catch(handleApiError)
        .finally(() => {
          setTimeout(() => {
            this.loading = false;
          }, 500);
        });
    }
  }
};
</script>
