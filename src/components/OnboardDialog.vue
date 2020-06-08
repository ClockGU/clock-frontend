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
      </v-toolbar>

      <v-card-text class="pb-0">
        <v-window v-model="step">
          <v-window-item :value="0">
            <placeholder name="UndrawSubway">
              Du scheinst neu zu sein. Bevor du Clock nutzen kannst, musst du
              ein paar Dinge erledigen. Das Ganze dauert weniger als eine Minute
              und wir helfen dir dich einzurichten!
            </placeholder>
          </v-window-item>

          <v-window-item :value="1">
            <placeholder name="UndrawWorkInProgress">
              Wir erweitern Clock weiterhin mit neuen Funktionen. Dein Feedback
              kann uns helfen das System schneller zu verbessern. Zögere nicht
              uns zu kontaktieren, wenn dir etwas auf dem Herzen liegt!
            </placeholder>
          </v-window-item>

          <v-window-item :value="2">
            <p>Please enter your contract details below.</p>
            <ContractForm :entity="entity" @update="updateContractForm" />
          </v-window-item>

          <v-window-item :value="3">
            <placeholder name="UndrawFinishLine">
              Du hast es geschafft!
            </placeholder>
          </v-window-item>
        </v-window>
      </v-card-text>

      <v-card-actions>
        <v-btn :disabled="step == 0" text @click="step--">
          Back
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
          Next
        </v-btn>
        <v-btn v-else text color="primary" :loading="loading" @click="save"
          >Submit</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { handleApiError } from "@/utils/interceptors";
import { mdiDelete, mdiClose, mdiRecord } from "@mdi/js";

import ContractForm from "@/components/contracts/ContractForm";

import { ServiceFactory } from "@/factories/serviceFactory";

export default {
  name: "OnboardDialog",
  components: { ContractForm },
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
    titles: [
      "Onboarding",
      "Work in progress",
      "Create a contract",
      "You're done!"
    ],
    loading: false
  }),
  computed: {
    serviceRepository() {
      return ServiceFactory.get(this.entityName);
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
    save() {
      this.loading = true;
      this.service
        .create(this.contractToSave.toPayload())
        .then(() => {
          return this.$store.dispatch("contract/queryContracts");
        })
        .then(() => {
          setTimeout(() => {
            this.closeDialog();
          }, 200);
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
