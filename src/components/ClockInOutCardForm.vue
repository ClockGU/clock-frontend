<script setup>
import { mdiArrowLeft, mdiDelete } from "@mdi/js";
import ShiftFormDialog from "@/components/forms/dialogs/ShiftFormDialog.vue";
import { Shift } from "@/models/ShiftModel";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps({
  destroy: {
    type: Function,
    required: true
  },
  shift: {
    type: Shift,
    required: true
  },
  contractName: {
    type: String,
    required: true
  },
  overflow: {
    type: Boolean,
    default: false
  }
});

defineEmits(["updateWindow"]);

const dialog = ref(false);
const { t } = useI18n(); // use as global scope

function finish(saved) {
  this.$emit("updateWindow", -1);
  let message =
    this.t("dashboard.clock.problems.messages.success") + " ";
  if (saved) {
    message += this.t("dashboard.clock.problems.messages.saved");
  } else {
    message += this.t("dashboard.clock.problems.messages.noSaved");
  }
  this.$store.dispatch("snackbar/setSnack", {
    message: message,
    color: "success"
  });
}

</script>

<template>
  <v-card>
    <v-toolbar :elevation="0">
      <v-btn icon @click="$emit('updateWindow', -1)">
        <v-icon>{{ mdiArrowLeft }}</v-icon>
      </v-btn>
      <v-toolbar-title>
        {{ t("dashboard.clock.problems.title") }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="finish(false)">
        <v-icon>{{ mdiDelete }}</v-icon>
      </v-btn>
    </v-toolbar>

    <v-card-text>
      <v-row justify="center">
        <div class="d-flex flex-column text-error">
          <div class="font-weight-bold">
            {{ t("dashboard.clock.problems.text") }}
          </div>
          <div class="font-weight-light">
            {{ t("models.contract") }}: {{ contractName }}
          </div>
          <div v-if="overflow" class="font-weight-light">
            {{ t("dashboard.clock.problems.overflowedShift") }}
          </div>
          <div class="font-weight-light text-center">
            {{ t("dashboard.clock.problems.editShift") }}
          </div>
        </div>
      </v-row>
      <v-row justify="center">
        <ShiftFormDialog
          :shift="shift"
          btn-color="primary"
          text-button
          @save="finish(true)"
        ></ShiftFormDialog>
      </v-row>
    </v-card-text>
  </v-card>
</template>
