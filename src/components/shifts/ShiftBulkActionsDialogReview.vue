<template>
  <ConfirmationDialog
    :confirmation-button="confirmationButton"
    @confirm="review"
  >
    <template #activator="props">
      <slot name="activator" v-bind="props"></slot>
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
  emits: ["reset"],
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
        // Try reviewing
        const settledPromises = await ShiftService.bulkUpdate(payloadArray);
        // Filter and handle failed SHifts
        let failedPromises = settledPromises.filter(
          (prom) => prom.status === "rejected"
        );
        await this.handleFailedUpdates(failedPromises);
        for (const promise of settledPromises.filter(
          (prom) => prom.status !== "rejected"
        )) {
          this.$store.commit("contentData/updateShift", {
            contractID: promise.value.contract,
            shiftInstance: promise.value
          });
        }

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
    async handleFailedUpdates(failedPromises) {
      for (let promise of failedPromises) {
        await this.$store.dispatch("snackbar/setSnack", {
          message: this.$t("feedback.snackbar.reviewError", {
            dateAndTime:
              localizedFormat(promise.value.started, "EEEE',' do' 'MMMM") +
              " " +
              localizedFormat(promise.value.started, "HH:mm")
          }),
          timeout: 10000,
          color: "error",
          component: ShiftFormDialog,
          componentProps: {
            shift: promise.value,
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
