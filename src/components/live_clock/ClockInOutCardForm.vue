<script setup>
import { mdiDelete } from "@mdi/js";
import ShiftFormDialog from "@/components/forms/dialogs/ShiftFormDialog.vue";
import { Shift } from "@/models/ShiftModel";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";

const props = defineProps({
  contractName: {
    type: String,
    required: true
  },
  overflow: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["updateWindow"]);

const dialog = ref(false);
const { t } = useI18n(); // use as global scope
const store = useStore();

const model = defineModel({ type: [Shift, typeof undefined] });
function finish(saved) {
  emit("updateWindow", -1);
  model.value.value = undefined;
  let message = this.t("dashboard.clock.problems.messages.success") + " ";
  if (saved) {
    message += this.t("dashboard.clock.problems.messages.saved");
  } else {
    message += this.t("dashboard.clock.problems.messages.noSaved");
  }
  store.dispatch("snackbar/setSnack", {
    message: message,
    color: "success"
  });
}
</script>

<template>
  <v-card aria-describedby="clock-in-out-title">
    <v-toolbar :elevation="0">
      <v-toolbar-title>
        <h2 id="clock-in-out-title">
          {{ t("dashboard.clock.problems.title") }}
        </h2>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="finish(false)">
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
          :shift="model"
          btn-color="primary"
          text-button
          @save="finish(true)"
        ></ShiftFormDialog>
      </v-row>
    </v-card-text>
  </v-card>
</template>
