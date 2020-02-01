<template>
  <v-dialog
    v-model="mainDialog"
    :fullscreen="$vuetify.breakpoint.smAndDown"
    max-width="600"
    no-click-animation
    persistent
    @keydown.esc="closeMainDialog"
  >
    <v-card>
      <v-toolbar flat>
        <v-btn
          v-if="$vuetify.breakpoint.smAndDown"
          icon
          @click="closeMainDialog"
        >
          <v-icon>{{ icons.mdiClose }}</v-icon>
        </v-btn>
        <v-toolbar-title>
          {{
            contractEntity.uuid !== null ? "Update contract" : "Create contract"
          }}
        </v-toolbar-title>
        <v-spacer v-if="$vuetify.breakpoint.smAndDown"></v-spacer>
        <v-toolbar-items v-if="$vuetify.breakpoint.smAndDown">
          <v-btn
            v-if="contractEntity.uuid !== null"
            icon
            @click="confirmDialog = true"
          >
            <v-icon>{{ icons.mdiDelete }}</v-icon>
          </v-btn>
          <v-btn
            text
            :disabled="!formValid"
            @click="contractToSave.uuid === null ? save() : update()"
          >
            Save
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text class="pb-0">
        <ContractForm
          :entity="contractEntity"
          :uuid="contractEntity.uuid"
          :now="now"
          @cancel="closeMainDialog"
          @destroy="destroy"
          @save="save"
          @update="updateData"
        />
      </v-card-text>

      <v-card-actions v-if="$vuetify.breakpoint.mdAndUp">
        <v-btn
          data-cy="shift-save"
          text
          :disabled="!formValid"
          color="primary"
          @click="contractToSave.uuid === null ? save() : update()"
        >
          Save
        </v-btn>
        <v-btn data-cy="shift-cancel" text @click="closeMainDialog">
          Cancel
        </v-btn>

        <v-spacer></v-spacer>
        <v-btn
          v-if="contractToSave.uuid !== null"
          data-cy="shift-form-delete-button"
          text
          color="error"
          @click="confirmDialog = true"
        >
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-dialog v-model="confirmDialog" max-width="500px">
      <v-card data-cy="delete-dialog">
        <v-card-title>
          <span class="headline">Delete contract?</span>
        </v-card-title>

        <v-card-text>
          This will delete all shifts created inside this contract. This action
          is not reversible.
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn data-cy="delete-cancel" text @click="confirmDialog = false">
            Cancel
          </v-btn>
          <v-btn data-cy="delete-confirm" color="error" text @click="destroy">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script>
import ContractService from "@/services/contract";
import ContractForm from "@/components/contracts/ContractForm";
import { handleApiError } from "@/utils/interceptors";

import { mdiDelete, mdiClose } from "@mdi/js";

export default {
  name: "ContractFormDialog",
  components: { ContractForm },
  props: {
    now: {
      type: Date,
      default: () => new Date()
    },
    contractEntity: {
      type: Object || null,
      default: null
    }
  },
  data: () => ({
    confirmDialog: false,
    formValid: true,
    mainDialog: true,
    icons: {
      mdiDelete,
      mdiClose
    },
    contractToSave: null
  }),
  created() {
    // Make a copy of the shift we will save.
    this.contractToSave = this.contractEntity;
  },
  methods: {
    updateData(event) {
      this.contractToSave = event.contract;
      this.formValid = event.valid;
    },
    closeMainDialog() {
      this.$emit("close");
    },
    destroy() {
      ContractService.delete(this.contractToSave.uuid)
        .then(() => {
          this.$emit("refresh");
        })
        .catch(handleApiError)
        .finally(() => {
          this.closeMainDialog();
        });
    },
    update() {
      ContractService.update(
        this.contractToSave.toPayload(),
        this.contractToSave.uuid
      )
        .then(() => {
          this.$emit("refresh");
          this.closeMainDialog();
        })
        .catch(handleApiError);
    },
    save() {
      ContractService.create(this.contractToSave.toPayload())
        .then(() => {
          this.$emit("refresh");
          this.closeMainDialog();
        })
        .catch(handleApiError);
    }
  }
};
</script>
