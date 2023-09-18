<template>
  <ConfirmationDialog
    :confirmation-button="confirmationButton"
    @confirm="review"
  >
    <template #activator="{ on }">
      <slot name="activator" :on="on"></slot>
    </template>

    <template #title>
      {{ $t("shifts.review.title") }}
    </template>

    <template #text>
      {{ $t("shifts.review.text") }}
    </template>
  </ConfirmationDialog>
</template>

<script>
import { mdiFileDocumentEditOutline } from "@mdi/js";
import { ShiftService } from "@/services/models";
import { log } from "@/utils/log";

import { mapGetters } from "vuex";

import ConfirmationDialog from "@/components/ConfirmationDialog.vue";
import ShiftFormDialog from "@/components/forms/dialogs/ShiftFormDialog.vue";
import { localizedFormat } from "@/utils/date";

export default {
  name: "ShiftBulkActionsDialogReview",
  components: { ConfirmationDialog },
  props: {
    shifts: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    contract: null,
    dialog: false,
    loading: false,
    icons: { mdiFileDocumentEditOutline }
  }),
  computed: {
    ...mapGetters({
      contracts: "contract/contracts"
    }),
    confirmationButton() {
      return {
        text: this.$t("actions.confirm"),
        color: "primary"
      };
    }
  },
  created() {
    this.contract = this.shifts[0].contract;
  },
  methods: {
    async review() {
      this.loading = true;
      try {
        const payloadArray = this.shifts.map((shift) => {
          let payload = shift.toPayload();
          payload.was_reviewed = true;
          return payload;
        });
        const updatedShifts = await ShiftService.bulkUpdate(payloadArray);
        await this.handleFailedUpdates(updatedShifts);
        this.reset();
      } catch (error) {
        // TODO: Set error state for component & allow user to reload page
        // We usually should end up here, if we are already logging out.
        // But a proper error state could mitigate further issues.
        log(error);
      } finally {
        this.loading = false;
        this.dialog = false;
        const startDate = this.shifts.reduce((prev, curr) => {
          return prev.started < curr.started ? prev : curr;
        }).started;
        this.$store.dispatch("contentData/refreshReports", {
          contractID: this.contract,
          startDate
        });
      }
    },
    reset() {
      this.$emit("reset");
    },
    async handleFailedUpdates(promises) {
      let failedShiftIds = [];
      for (let prom of promises) {
        if (prom.status === "rejected") {
          failedShiftIds.push(JSON.parse(prom.reason.config.data).id);
        }
      }
      for (let shift of this.shifts.filter(
        (shift) => failedShiftIds.indexOf(shift.id) !== -1
      )) {
        await this.$store.dispatch("snackbar/setSnack", {
          message: this.$t("feedback.snackbar.reviewError", {
            dateAndTime:
              localizedFormat(shift.started, "EEEE',' do' 'MMMM") +
              " " +
              localizedFormat(shift.started, "HH:mm")
          }),
          timeout: 10000,
          color: "error",
          component: ShiftFormDialog,
          componentProps: {
            shift: shift,
            create: false,
            icon: true
          },
          timePassed: 0,
          show: true
        });
      }
    }
  }
};
</script>
