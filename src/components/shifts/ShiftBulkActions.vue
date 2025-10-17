<template>
  <v-expand-transition appear>
    <v-card
      elevation="0"
      role="toolbar"
      :aria-label="$t('aria.shiftBulkActions.description')"
    >
      <v-card-actions>
        <ShiftBulkActionsDialogReview
          v-if="canReview"
          :shifts="shifts"
          @reset="resetFn()"
        >
          <template #activator="{ props }">
            <v-btn
              :disabled="!reviewable"
              variant="flat"
              :icon="shiftsLength > 1 ? icons.mdiCheckAll : icons.mdiCheck"
              v-bind="props"
              :aria-label="$t('aria.shiftBulkActions.review')"
            />
          </template>
        </ShiftBulkActionsDialogReview>

        <ShiftAssignContractDialog :shifts="shifts" @save="updateFn">
          <template #activator="{ props }">
            <v-btn
              :disabled="!moreThanOneContract || shiftsLength < 1"
              variant="flat"
              v-bind="props"
              :icon="icons.mdiSwapHorizontal"
              :aria-label="$t('aria.shiftBulkActions.changeContract')"
            />
          </template>
        </ShiftAssignContractDialog>

        <ShiftsDetailsDialog
          v-if="xs"
          :disabled="shiftsLength !== 1"
          :shift="shifts[0]"
          @reset="resetFn()"
        >
          <template #activator="{ props }">
            <v-btn
              :disabled="shiftsLength !== 1"
              variant="flat"
              :icon="icons.mdiInformationVariant"
              v-bind="props"
              :aria-label="$t('aria.shiftBulkActions.viewDetails')"
            />
          </template>
        </ShiftsDetailsDialog>
        <ShiftActionsDialogEdit
          v-if="xs"
          :shift="shifts[0]"
          :disabled="shiftsLength !== 1"
          :showWarningIcon="shiftsLength === 1"
          @reset="resetFn()"
          @update="updateFn(shifts[0].contract)"
        >
        </ShiftActionsDialogEdit>
        <ShiftBulkActionsDialogDelete
          :count="shiftsLength"
          @destroy="destroyFn"
        >
          <template #activator="{ props }">
            <v-btn
              :disabled="shiftsLength < 1"
              variant="flat"
              :icon="icons.mdiDelete"
              v-bind="props"
              :aria-label="$t('aria.shiftBulkActions.delete')"
            />
          </template>
        </ShiftBulkActionsDialogDelete>

        <span
          role="status"
          :aria-live="polite"
          :aria-label="$t('aria.shiftBulkActions.durationSum', { durationSum })"
        >
          {{ durationSum }}
        </span>
      </v-card-actions>
    </v-card>
  </v-expand-transition>
</template>

<script>
import ShiftAssignContractDialog from "@/components/shifts/ShiftAssignContractDialog.vue";
import ShiftBulkActionsDialogDelete from "@/components/shifts/ShiftBulkActionsDialogDelete.vue";
import ShiftBulkActionsDialogReview from "@/components/shifts/ShiftBulkActionsDialogReview.vue";
import { minutesToHHMM } from "@/utils/time";
import breakpointsMixin from "@/mixins/breakpointsMixin";
import {
  mdiCheck,
  mdiCheckAll,
  mdiPencil,
  mdiSwapHorizontal,
  mdiDelete,
  mdiInformationVariant
} from "@mdi/js";
import ShiftsDetailsDialog from "./ShiftsDetailsDialog.vue";
import ShiftActionsDialogEdit from "./ShiftActionsDialogEdit.vue";

export default {
  name: "ShiftBulkActions",
  components: {
    ShiftAssignContractDialog,
    ShiftBulkActionsDialogDelete,
    ShiftBulkActionsDialogReview,
    ShiftActionsDialogEdit,
    ShiftsDetailsDialog
  },
  mixins: [breakpointsMixin],
  props: {
    canReview: {
      type: Boolean,
      default: false
    },
    shifts: {
      type: Array,
      required: true
    },
    moreThanOneContract: {
      type: Boolean,
      required: false,
      default: false
    },
    resetFn: {
      type: Function,
      required: false,
      default: () => {}
    }
  },
  emits: ["destroy", "update"],
  data: () => ({
    icons: {
      mdiCheck,
      mdiCheckAll,
      mdiPencil,
      mdiSwapHorizontal,
      mdiDelete,
      mdiInformationVariant
    }
  }),
  computed: {
    reviewable() {
      return this.shifts.filter((shift) => shift.wasReviewed === false).length;
    },
    durationSum() {
      let sum = 0;
      this.shifts.forEach((shift) => {
        sum += shift.duration;
      });
      return "| " + minutesToHHMM(sum, "") + "h";
    },
    shiftsLength() {
      return this.shifts.length;
    }
  },

  methods: {
    async destroyFn() {
      await this.$store.dispatch("contentData/bulkDeleteShifts", this.shifts);
      this.resetFn();
      this.$emit("destroy");
    },
    async updateFn(contractInstance) {
      await this.$store.dispatch("contentData/bulkSwitchContract", {
        shiftArray: this.shifts,
        newContract: contractInstance,
        initialContract: this.shifts[0].contract
      });
      this.resetFn();
      this.$emit("update");
    }
  }
};
</script>
