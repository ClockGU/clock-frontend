<template>
  <v-card-text class="pb-0">
    <div class="sr-only" aria-live="polite">
      <span v-if="alertMessages.length > 0">
        {{ $tc("sr.shiftFormFields.warningLabel", { count: alertMessages.length }) }}
        {{ alertMessages }}
      </span>
    </div>
    <ShiftFormDatetimeInput
      v-model:started="shift.started"
      v-model:stopped="shift.stopped"
      :contract-id="shift.contract"
    />
    <v-row align="center" justify="start">
      <v-col cols="12" class="mt-3 ml-1 mr-1">
        <v-expansion-panels :disabled="alertMessages.length === 0">
          <v-expansion-panel>
            <v-expansion-panel-title
              :color="alertMessages.length !== 0 ? alertType : ''"
              >{{
                $tc("shifts.warningLabel", { count: alertMessages.length })
              }}</v-expansion-panel-title
            >
            <v-expansion-panel-text class="ma-0">
              <ClockCardAlert
                :messages="alertMessages"
                :type="alertType"
              ></ClockCardAlert>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
      <v-col cols="12">
        <v-checkbox
          v-model="showRepeat"
          :label="$t('shifts.repeating.checkboxLabel')"
          :prepend-icon="icons.mdiRepeat"
          :disabled="!isInFuture"
          :messages="$t('shifts.repeating.checkboxText')"
        ></v-checkbox>
        <v-expand-transition hide-on-leave>
          <ShiftFormRepeat
            v-show="showRepeat"
            v-model="scheduledShifts"
            :shift="shift"
          />
        </v-expand-transition>
        <v-divider class="mt-4" />
      </v-col>
      <v-col cols="12">
        <ShiftFormTags v-model="shift.tags" />
        <ShiftFormNote v-model="shift.note" />
        <v-list-subheader class="pl-8">
          {{ $t("shifts.types.label") }}
        </v-list-subheader>
        <ShiftFormType v-model="shift.type" />
      </v-col>
      <v-col cols="12">
        <v-divider></v-divider>
      </v-col>
      <v-col cols="12" class="pb-0">
        <ShiftFormSelectContract
          v-model="shift.contract"
          :validation-date="shift.started"
          @update:model-value="setValidDate"
        />
        <ShiftFormReview :value="shift.wasReviewed"></ShiftFormReview>
      </v-col>
    </v-row>
  </v-card-text>
</template>

<script>
import { Shift } from "@/models/ShiftModel";

import ShiftFormRepeat from "@/components/shifts/ShiftFormRepeat.vue";
import ShiftFormNote from "@/components/shifts/ShiftFormNote.vue";
import ShiftFormTags from "@/components/shifts/ShiftFormTags.vue";
import ShiftFormType from "@/components/shifts/ShiftFormType.vue";
import ShiftFormSelectContract from "@/components/shifts/ShiftFormSelectContract.vue";
import { isBefore, isPast, isAfter, startOfDay, isFuture } from "date-fns";
import { mdiRepeat } from "@mdi/js";
import ShiftFormDatetimeInput from "@/components/shifts/ShiftFormDatetimeInput.vue";
import ClockCardAlert from "@/components/ClockCardAlert.vue";
import ShiftFormReview from "@/components/shifts/ShiftFormReview.vue";
export default {
  name: "ShiftFormFields",
  components: {
    ShiftFormReview,
    ShiftFormDatetimeInput,
    ShiftFormTags,
    ShiftFormNote,
    ShiftFormType,
    ShiftFormSelectContract,
    ShiftFormRepeat,
    ClockCardAlert
  },
  props: {
    modelValue: {
      type: Shift,
      required: true
    },
    alertMessages: {
      type: Array,
      default: () => []
    },
    alertType: {
      type: String,
      default: "alert"
    }
  },
  emits: ["update:modelValue", "scheduleShifts", "update:modelValue"],
  data() {
    return {
      shift: this.modelValue,
      showRepeat: false,
      icons: {
        mdiRepeat
      },
      scheduledShifts: null
    };
  },
  computed: {
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
    },
    isInFuture() {
      return isFuture(this.shift.stopped);
    }
  },
  watch: {
    modelValue(value) {
      this.shift = value;
    },
    shift: {
      handler(value) {
        value.wasReviewed = !this.isInFuture;
        this.$emit("update:modelValue", value);
      },
      deep: true
    },
    scheduledShifts(value) {
      if (this.showRepeat) {
        this.$emit("scheduleShifts", value);
      }
    },
    showRepeat(value) {
      if (!value) {
        this.resetScheduledShifts();
        return;
      }
      // Need to emit this on the inital showRepeat = true set.
      this.$emit("scheduleShifts", this.scheduledShifts);
    }
  },
  created() {
    const stopTime = {
      hours: this.shift.stopped.getHours(),
      min: this.shift.stopped.getMinutes(),
      sec: this.shift.stopped.getSeconds()
    };
    this.shift.wasReviewed = !this.isInFuture;
  },
  methods: {
    setValidDate() {
      // If a user changes the coontract of a shift we want to
      // set the start date to the first valid date possible in the newly
      // selected contract.
      const startTime = [
        this.shift.started.getHours(),
        this.shift.started.getMinutes(),
        this.shift.started.getSeconds()
      ];
      const stopTime = [
        this.shift.stopped.getHours(),
        this.shift.stopped.getMinutes(),
        this.shift.stopped.getSeconds()
      ];
      const contractObj = this.$store.getters["contentData/contractById"](
        this.shift.contract
      );
      let date = this.shift.started;
      if (isBefore(this.shift.started, contractObj.startDate)) {
        date = contractObj.startDate;
        date.setHours.apply(date, startTime);
      } else if (isAfter(this.shift.started, contractObj.endDate)) {
        date = contractObj.endDate;
        date.setHours.apply(date, startTime);
      }
      this.shift.started = date;
      const endDate = new Date(date);
      endDate.setHours.apply(endDate, stopTime);
      this.shift.stopped = endDate;
    },
    resetScheduledShifts() {
      this.scheduledShifts = null;
    }
  }
};
</script>

<style scoped>
.link-coloring {
  color: blue;
}
:deep(.v-expansion-panel-text__wrapper) {
  padding: unset;
}
</style>

