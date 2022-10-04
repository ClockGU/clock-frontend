<template>
  <v-card-text>
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
    <v-btn @click="toggleDi">Toggle</v-btn>
  </v-card-text>
</template>

<script>
import { Shift } from "@/models/ShiftModel";
import ShiftFormNote from "@/components/shifts/ShiftFormNote";
import ShiftFormTags from "@/components/shifts/ShiftFormTags";
import ShiftFormType from "@/components/shifts/ShiftFormType";
import ShiftFormSelectContract from "@/components/shifts/ShiftFormSelectContract";
import { endOfDay, isWithinInterval, startOfDay } from "date-fns";
import ShiftUtilityMixin from "@/mixins/ShiftUtilityMixin";
import ShiftFormReview from "@/components/shifts/ShiftFormReview";
export default {
  name: "ShiftFormFields",
  components: {
    ShiftFormReview,
    ShiftFormTags,
    ShiftFormNote,
    ShiftFormType,
    ShiftFormSelectContract
  },
  mixins: [ShiftUtilityMixin],
  props: {
    value: {
      type: Shift,
      required: true
    }
  },
  data() {
    return { shift: this.value, showRepeat: false, di: false };
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
    value(val) {
      this.shift = val;
    },
    shift(value) {
      this.$emit("input", value);
    }
  },
  methods: {
    toggleDi() {
      console.log("Here");
      this.di = !this.di;
    }
  }
};
</script>

<style scoped></style>
