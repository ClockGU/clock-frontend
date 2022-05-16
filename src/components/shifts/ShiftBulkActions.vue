<template>
  <v-expand-transition appear>
    <v-card elevation="0">
      <v-card-actions>
        <v-btn
          :disabled="shifts.length != 1"
          icon
          @click="$emit('edit', shifts[0].shift)"
        >
          <v-icon>{{ icons.mdiPencil }}</v-icon>
        </v-btn>

        <ShiftBulkActionsDialogReview
          v-if="canReview"
          :shifts="shifts"
          @reset="$emit('refresh')"
        >
          <template #activator="{ on }">
            <v-btn :disabled="!reviewable" icon v-on="on">
              <v-icon>{{
                shifts.length > 1 ? icons.mdiCheckAll : icons.mdiCheck
              }}</v-icon>
            </v-btn>
          </template>
        </ShiftBulkActionsDialogReview>

        <ShiftAssignContractDialog :shifts="shifts" @reset="$emit('refresh')">
          <template #activator="{ on }">
            <v-btn
              :disabled="contracts.length < 2 || shifts.length < 1"
              icon
              v-on="on"
            >
              <v-icon>{{ icons.mdiSwapHorizontal }}</v-icon>
            </v-btn>
          </template>
        </ShiftAssignContractDialog>

        <ShiftBulkActionsDialogDelete
          :count="shifts.length"
          @destroy="destroyFn"
        >
          <template #activator="{ on }">
            <v-btn :disabled="shifts.length < 1" icon v-on="on">
              <v-icon>{{ icons.mdiDelete }}</v-icon>
            </v-btn>
          </template>
        </ShiftBulkActionsDialogDelete>
        {{ durationSum }}
      </v-card-actions>
    </v-card>
  </v-expand-transition>
</template>

<script>
import ShiftAssignContractDialog from "@/components/shifts/ShiftAssignContractDialog";
import ShiftBulkActionsDialogDelete from "@/components/shifts/ShiftBulkActionsDialogDelete";
import ShiftBulkActionsDialogReview from "@/components/shifts/ShiftBulkActionsDialogReview";
import { minutesToHHMM } from "@/utils/time";
import {
  mdiCheck,
  mdiCheckAll,
  mdiPencil,
  mdiSwapHorizontal,
  mdiDelete
} from "@mdi/js";

export default {
  name: "ShiftBulkActions",
  components: {
    ShiftAssignContractDialog,
    ShiftBulkActionsDialogDelete,
    ShiftBulkActionsDialogReview
  },
  props: {
    // We need to pass a destroy function, because we cannot reset the
    // `this.selected` in `ShiftsTable.vue` otherwise.
    destroyFn: {
      type: Function,
      required: true
    },
    canReview: {
      type: Boolean,
      default: false
    },
    shifts: {
      type: Array,
      required: true
    },
    contracts: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    icons: { mdiCheck, mdiCheckAll, mdiPencil, mdiSwapHorizontal, mdiDelete }
  }),
  computed: {
    reviewable() {
      return this.shifts.filter((shift) => shift.reviewed == false).length;
    },
    durationSum() {
      let sum = 0;
      this.shifts.forEach((shift) => {
        sum += shift.duration;
      });
      return sum > 0 ? "| " + minutesToHHMM(sum, "") + "h Arbeitszeit" : "";
    }
  }
};
</script>
