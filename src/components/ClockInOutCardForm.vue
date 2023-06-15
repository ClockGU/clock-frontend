<template>
  <v-card>
    <v-toolbar :elevation="0">
      <v-btn icon @click="$emit('updateWindow', -1)">
        <v-icon>{{ icons.mdiArrowLeft }}</v-icon>
      </v-btn>
      <v-toolbar-title>
        {{ $t("dashboard.clock.problems.title") }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="finish(false)">
        <v-icon>{{ icons.mdiDelete }}</v-icon>
      </v-btn>
    </v-toolbar>

    <v-card-text>
      <v-row justify="center">
        <div class="d-flex flex-column error--text">
          <div class="font-weight-bold">
            {{ $tc("dashboard.clock.problems.text") }}
          </div>
          <div class="font-weight-light">
            {{ $tc("models.contract") }}: {{ contractName }}
          </div>
          <div v-if="overflow" class="font-weight-light">
            {{ $t("dashboard.clock.problems.overflowedShift") }}
          </div>
          <div class="font-weight-light text-center">
            {{ $tc("dashboard.clock.problems.editShift") }}
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

<script>
import { mdiArrowLeft, mdiDelete } from "@mdi/js";
import ShiftFormDialog from "@/components/forms/dialogs/ShiftFormDialog";
import { Shift } from "@/models/ShiftModel";

export default {
  name: "ClockInOutCardForm",
  components: { ShiftFormDialog },
  props: {
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
  },
  data: () => ({
    dialog: false,
    icons: { mdiArrowLeft, mdiDelete }
  }),
  methods: {
    finish(saved) {
      this.$emit("updateWindow", -1);
      this.destroy(false).then(() => {
        let message =
          this.$t("dashboard.clock.problems.messages.success") + " ";
        if (saved) {
          message += this.$t("dashboard.clock.problems.messages.saved");
        } else {
          message += this.$t("dashboard.clock.problems.messages.noSaved");
        }
        this.$store.dispatch("snackbar/setSnack", {
          snack: message,
          timeout: 4000,
          color: "success"
        });
      });
    }
  }
};
</script>
