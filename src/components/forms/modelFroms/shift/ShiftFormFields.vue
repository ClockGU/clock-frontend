<template>
  <v-card-text>
    <v-checkbox
      v-model="showRepeat"
      :label="$t('shifts.repeating.checkboxLabel')"
      :prepend-icon="icons.mdiRepeat"
      class="ma-0"
    ></v-checkbox>

    <v-expand-transition hide-on-leave>
      <ShiftFormRepeat
        v-if="showRepeat"
        v-model="scheduledShifts"
        :shift="shift"
      />
    </v-expand-transition>

    <ShiftFormTags v-model="shift.tags" />
    <ShiftFormNote v-model="shift.note" />
    <ShiftFormType v-model="shift.type" />
    <ShiftFormSelectContract
      v-model="shift.contract"
      :choices="validContracts"
    />
    <ShiftFormReview
      v-model="shift.wasReviewed"
      :error-message="reviewMessage"
    />
  </v-card-text>
</template>

<script>
import { Shift } from "@/models/ShiftModel";
import ShiftFormRepeat from "@/components/shifts/ShiftFormRepeat";
import ShiftFormNote from "@/components/shifts/ShiftFormNote";
import ShiftFormTags from "@/components/shifts/ShiftFormTags";
import ShiftFormType from "@/components/shifts/ShiftFormType";
import ShiftFormSelectContract from "@/components/shifts/ShiftFormSelectContract";
import { endOfDay, isWithinInterval, startOfDay } from "date-fns";
import ShiftUtilityMixin from "@/mixins/ShiftUtilityMixin";
import ShiftFormReview from "@/components/shifts/ShiftFormReview";
import { mdiRepeat } from "@mdi/js";
export default {
  name: "ShiftFormFields",
  components: {
    ShiftFormReview,
    ShiftFormTags,
    ShiftFormNote,
    ShiftFormType,
    ShiftFormSelectContract,
    ShiftFormRepeat
  },
  mixins: [ShiftUtilityMixin],
  props: {
    value: {
      type: Shift,
      required: true
    }
  },
  data() {
    return {
      shift: this.value,
      showRepeat: false,
      icons: {
        mdiRepeat
      },
      scheduledShifts: null
    };
  },
  computed: {
    validContracts() {
      return this.$store.getters["contentData/allContracts"].filter(
        //TODO: Solve this with a mixin
        (contract) => {
          return isWithinInterval(this.shift.started, {
            start: startOfDay(contract.startDate),
            end: endOfDay(contract.endDate)
          });
        }
      );
    },
    reviewMessage() {
      if (this.isRunningShift) {
        return this.$t("shifts.reviewErrorLive");
      } else if (!this.shift.wasReviewed && !this.showRepeat) {
        return !this.startsInFuture
          ? this.$t("shifts.reviewErrorPast")
          : this.$t("shifts.reviewErrorFuture");
      } else {
        return "";
      }
    }
  },
  watch: {
    value(value) {
      this.shift = value;
    },
    shift(value) {
      this.$emit("input", value);
    },
    scheduledShifts(value) {
      console.log("called", value);
      this.$emit("scheduleShifts", value);
    }
  }
};
</script>

<style scoped></style>
