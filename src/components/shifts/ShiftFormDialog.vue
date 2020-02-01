<template>
  <v-dialog
    v-model="mainDialog"
    :fullscreen="$vuetify.breakpoint.smAndDown"
    max-width="600"
    @click:outside="closeMainDialog"
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
        <v-toolbar-title>Update shift</v-toolbar-title>
        <v-spacer v-if="$vuetify.breakpoint.smAndDown"></v-spacer>
        <v-toolbar-items v-if="$vuetify.breakpoint.smAndDown">
          <v-btn icon @click="confirmDialog = true">
            <v-icon>{{ icons.mdiDelete }}</v-icon>
          </v-btn>
          <v-btn text @click="save">Save</v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text>
        <ShiftForm
          :entity="shiftEntity"
          :uuid="shiftEntity.uuid"
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
          @click="shiftToSave.uuid === null ? save() : update()"
        >
          Save
        </v-btn>
        <v-btn data-cy="shift-cancel" text @click="closeMainDialog">
          Cancel
        </v-btn>

        <v-spacer></v-spacer>
        <v-btn
          v-if="shiftToSave.uuid !== null"
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
          <span class="headline">Delete shift?</span>
        </v-card-title>

        <v-card-text>
          Deleting the shift is a permanent action.
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
import ShiftService from "@/services/shift";
import ShiftForm from "@/components/shifts/ShiftForm";
// import { handleApiError } from "@/utils/interceptors";

import { mdiDelete, mdiClose } from "@mdi/js";

export default {
  name: "ShiftFormDialog",
  components: { ShiftForm },
  props: {
    now: {
      type: Date,
      default: () => new Date()
    },
    shiftEntity: {
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
    shiftToSave: null
  }),
  created() {
    // Make a copy of the shift we will save.
    this.shiftToSave = this.shiftEntity;
  },
  methods: {
    updateData(event) {
      this.shiftToSave = event.shift;
      this.formValid = event.valid;
    },
    closeMainDialog() {
      this.$emit("close");
    },
    destroy() {
      ShiftService.delete(this.shiftToSave.uuid)
        .then(() => {
          this.$emit("refresh");
        })
        .finally(() => {
          this.closeMainDialog();
        });
    },
    update() {
      ShiftService.update(this.shiftToSave.toPayload(), this.shiftToSave.uuid)
        .then(() => {
          this.$emit("refresh");
        })
        .finally(() => {
          this.closeMainDialog();
        });
    },
    save() {
      ShiftService.create(this.shiftToSave.toPayload())
        .then(() => {
          this.$emit("refresh");
        })
        .finally(() => {
          this.closeMainDialog();
        });
    }
  }
};
</script>
