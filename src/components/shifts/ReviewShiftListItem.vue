<template>
  <ShiftListItem
    :editable="true"
    :shift="shift"
    :error="!valid"
    hide-reviewed-chip
  >
    <template #actions>
      <v-list-item-action start end>
        <ShiftFormDialog icon :shift="shift"></ShiftFormDialog>
      </v-list-item-action>
      <v-list-item-action start>
        <v-btn flat icon :disabled="!valid" @click="review">
          <v-icon
            :icon="icons.mdiCheck"
            color="success"
            :disabled="!valid"
            @click="review"
          ></v-icon>
        </v-btn>
      </v-list-item-action>
      <v-list-item-action>
        {{ $t("shifts.review.review") }}
      </v-list-item-action>
    </template>
    <template #extraSubtitle>
      <v-list-item-subtitle v-if="!valid" class="text-error">
        {{ $t("shifts.review.unableToReview") }}
      </v-list-item-subtitle>
    </template>
  </ShiftListItem>
</template>

<script>
import ShiftListItem from "@/components/shifts/ShiftListItem.vue";
import ShiftFormDialog from "@/components/forms/dialogs/ShiftFormDialog.vue";
import { mdiCheck } from "@mdi/js";
import { Shift } from "@/models/ShiftModel";
import ShiftValidationMixin from "@/mixins/ShiftValidationMixin";
export default {
  name: "ReviewShiftListItem",
  components: { ShiftFormDialog, ShiftListItem },
  mixins: [ShiftValidationMixin],
  props: {
    shift: {
      type: Shift,
      required: true
    }
  },
  data() {
    return {
      icons: {
        mdiCheck
      },
      newShift: this.shift
    };
  },
  watch: {
    shift(val) {
      this.newShift = val;
    }
  },
  created() {
    this.newShift = this.shift;
  },
  methods: {
    review() {
      this.newShift.wasReviewed = true;
      try {
        this.$store.dispatch("contentData/updateShift", {
          payload: this.newShift.toPayload(),
          initialContract: this.newShift.contract
        });
      } catch (e) {
        this.newShift.wasReviewed = false;
        throw Error(e);
      } finally {
        this.$store.dispatch("contentData/refreshReports", {
          startDate: this.newShift.started,
          contractID: this.newShift.contract
        });
      }
    }
  }
};
</script>

<style scoped></style>
