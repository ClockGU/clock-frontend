<template>
  <v-dialog
    v-model="mainDialog"
    :fullscreen="$vuetify.breakpoint.smAndDown"
    max-width="600"
    persistent
    no-click-animation
    retain-focus
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
            uuid !== null
              ? $t("dashboard.clock.problems.update")
              : $t("dashboard.clock.problems.create")
          }}
        </v-toolbar-title>
        <v-spacer v-if="$vuetify.breakpoint.smAndDown"></v-spacer>
        <v-toolbar-items v-if="$vuetify.breakpoint.smAndDown">
          <v-btn v-if="uuid !== null" icon @click="confirmDialog = true">
            <v-icon>{{ icons.mdiDelete }}</v-icon>
          </v-btn>
          <v-btn text color="primary" @click="save">{{
            $t("actions.save")
          }}</v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text class="pb-0">
        <ShiftForm
          :entity="shiftEntity"
          :uuid="uuid"
          :now="now"
          @cancel="closeMainDialog"
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
          @click="save"
        >
          {{ $t("actions.save") }}
        </v-btn>
        <v-btn data-cy="shift-cancel" text @click="closeMainDialog">
          {{ $t("actions.cancel") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import ShiftForm from "@/components/shifts/ShiftForm";

import { mdiDelete, mdiClose } from "@mdi/js";

export default {
  name: "ShiftReviewFormDialog",
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
  computed: {
    uuid() {
      return this.shiftEntity === null ? null : this.shiftEntity.uuid;
    }
  },
  created() {
    // Make a copy of the shift we will save.
    this.shiftToSave = this.shiftEntity;

    const close = (e) => {
      const ESC = 27;
      if (e.keyCode !== ESC) return;
      this.closeMainDialog();
    };
    // Close the modal when the
    // user presses the ESC key.
    document.addEventListener("keyup", close);
    this.$on("hook:destroyed", () => {
      document.removeEventListener("keyup", close);
    });
  },
  methods: {
    updateData(event) {
      this.shiftToSave = event.shift;
      this.formValid = event.valid;
    },
    closeMainDialog() {
      this.$emit("close");
    },
    save() {
      this.$emit("update", this.shiftToSave);
    }
  }
};
</script>
