<template>
  <v-expand-transition appear>
    <v-card elevation="0">
      <v-card-actions>
        <!--v-btn
          :disabled="shiftsLength != 1"
          icon
          @click="$emit('edit', shifts[0].shift)"
        >
          <v-icon>{{ icons.mdiPencil }}</v-icon>
        </v-btn-->

        <ShiftBulkActionsDialogReview
          v-if="canReview"
          :shifts="shifts"
          @reset="resetFn()"
        >
          <template #activator="{ on }">
            <v-btn :disabled="!reviewable" icon v-on="on">
              <v-icon
                >{{ shiftsLength > 1 ? icons.mdiCheckAll : icons.mdiCheck }}
              </v-icon>
            </v-btn>
          </template>
        </ShiftBulkActionsDialogReview>

        <ShiftAssignContractDialog :shifts="shifts" @save="updateFn">
          <template #activator="{ on }">
            <v-btn
              :disabled="!moreThanOneContract || shiftsLength < 1"
              icon
              v-on="on"
            >
              <v-icon>{{ icons.mdiSwapHorizontal }}</v-icon>
            </v-btn>
          </template>
        </ShiftAssignContractDialog>

        <ShiftBulkActionsDialogDelete
          :count="shiftsLength"
          @destroy="destroyFn"
        >
          <template #activator="{ on }">
            <v-btn :disabled="shiftsLength < 1" icon v-on="on">
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
  data: () => ({
    icons: { mdiCheck, mdiCheckAll, mdiPencil, mdiSwapHorizontal, mdiDelete }
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
