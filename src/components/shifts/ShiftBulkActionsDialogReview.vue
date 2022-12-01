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

import ConfirmationDialog from "@/components/ConfirmationDialog";

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
      // eslint-disable-next-line no-unreachable
      const promises = [];
      this.loading = true;
      try {
        for (let shift of this.shifts) {
          shift.wasReviewed = true;
          const payload = shift.toPayload();
          promises.push(ShiftService.update(payload, payload.id));
        }
        await Promise.all(promises);
        const startDate = this.shifts.reduce((prev, curr) => {
          return prev.started < curr.started ? prev : curr;
        }).started;

        this.$store.dispatch("contentData/refreshReports", {
          contractID: this.contract,
          startDate
        });
        this.reset();
      } catch (error) {
        // TODO: Set error state for component & allow user to reload page
        // We usually should end up here, if we are already logging out.
        // But a proper error state could mitigate further issues.
        log(error);
      } finally {
        this.loading = false;
        this.dialog = false;
      }
    },
    reset() {
      this.$emit("reset");
    }
  }
};
</script>
