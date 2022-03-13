<template>
  <v-form>
    <v-overlay v-if="shiftExported" light :dark="false">
      <v-card
        data-cy="overlay"
        class="mx-auto word-break"
        min-width="400"
        max-width="500"
      >
        <v-card-title class="text-h5">
          {{ $t("shifts.dave") }}
        </v-card-title>

        <v-card-text>
          {{ $t("shifts.wasExportedAlert") }}
        </v-card-text>

        <v-card-actions>
          <v-btn
            data-cy="overlay-ack"
            color="primary"
            text
            @click="$emit('cancel')"
          >
            {{ $t("actions.back") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-overlay>

    <v-alert
      v-if="isRunningShift"
      dense
      outlined
      type="error"
      :icon="icons.mdiCircleMedium"
    >
      {{ $t("shifts.running") }} {{ $tc("models.shift", 1) }}
    </v-alert>

    <v-row align="center" justify="start">
      <v-col cols="12" md="5">
        <ShiftFormDateInput
          v-model="shift"
          data-cy="shift-date"
          :min="contract.date.start"
          :max="contract.date.end"
          label="Date"
        />
      </v-col>

      <v-col cols="6" md="3">
        <ShiftFormTimeInput
          v-model="shift"
          data-cy="shift-start-time"
          type="start"
          :error="startError"
          :prepend-icon="$vuetify.breakpoint.smAndDown"
        />
      </v-col>

      <v-col cols="1" class="px-0 text-center">
        {{ $t("shifts.to") }}
      </v-col>

      <v-col cols="5" md="3">
        <ShiftFormTimeInput
          v-model="shift"
          data-cy="shift-end-time"
          type="end"
          :error="endError"
        />
      </v-col>

      <v-col cols="12">
        <v-checkbox
          v-model="showRepeat"
          :label="$t('shifts.repeating.checkboxLabel')"
          :prepend-icon="icons.mdiRepeat"
        ></v-checkbox>

        <v-expand-transition hide-on-leave>
          <ShiftFormRepeat
            v-if="showRepeat"
            :contract-end-date="contractEndDate"
            :date="shiftStart"
            :shift="shift"
            @update="setScheduledShifts"
          />
        </v-expand-transition>

        <v-divider />
      </v-col>

      <v-col cols="12">
        <ShiftFormTags v-model="shift.tags" data-cy="shift-tags" />

        <ShiftFormNote v-model="shift.note" data-cy="shift-note" />

        <v-subheader class="pl-8">
          {{ $t("shifts.types.label") }}
        </v-subheader>
        <ShiftFormType v-model="shift.type" data-cy="shift-type" />
      </v-col>

      <v-col cols="12">
        <v-divider></v-divider>
      </v-col>

      <v-col cols="12" class="pb-0">
        <v-select
          v-model="shift.contract"
          data-cy="shift-contract"
          :items="contracts"
          :prepend-icon="icons.mdiFileDocumentEditOutline"
          :label="$t('shifts.changeContract')"
          item-text="name"
          item-value="uuid"
          filled
        ></v-select>
        <v-checkbox
          v-model="shift.reviewed"
          :error-messages="reviewMessage()"
          :disabled="showRepeat || startsInFuture || isRunningShift"
          :indeterminate="showRepeat"
          :success="shift.reviewed && toBeReviewed"
          :prepend-icon="icons.mdiProgressCheck"
          :label="$t('shifts.reviewed')"
          class="mt-0 pt-0"
        ></v-checkbox>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import ShiftFormDateInput from "@/components/shifts/ShiftFormDateInput";
import ShiftFormTimeInput from "@/components/shifts/ShiftFormTimeInput";
import ShiftFormType from "@/components/shifts/ShiftFormType";
import ShiftFormNote from "@/components/shifts/ShiftFormNote";
import ShiftFormTags from "@/components/shifts/ShiftFormTags";
import ShiftFormRepeat from "@/components/shifts/ShiftFormRepeat";

import { Shift } from "@/models/ShiftModel";
import { Contract } from "@/models/ContractModel";

import { mapGetters } from "vuex";
import {
  isAfter,
  isBefore,
  isFuture,
  isSameDay,
  isEqual,
  isWithinInterval
} from "date-fns";
import { localizedFormat } from "@/utils/date";
import { startEndHours } from "@/utils/time";

import {
  mdiFileDocumentEditOutline,
  mdiProgressCheck,
  mdiRepeat,
  mdiCircleMedium
} from "@mdi/js";

export default {
  name: "ShiftForm",
  components: {
    ShiftFormDateInput,
    ShiftFormTimeInput,
    ShiftFormNote,
    ShiftFormType,
    ShiftFormTags,
    ShiftFormRepeat
  },
  filters: {
    formatDate(date) {
      return localizedFormat(date, "yyyy-MM-dd");
    },
    formatTime(date) {
      return localizedFormat(date, "HH:mm");
    }
  },
  props: {
    now: {
      type: Date,
      default: () => new Date()
    },
    uuid: {
      type: String,
      default: null
    },
    entity: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    icons: {
      mdiFileDocumentEditOutline,
      mdiProgressCheck,
      mdiRepeat,
      mdiCircleMedium
    },
    dialog: false,
    select: null,
    shift: null,
    toBeReviewed: false,
    showRepeat: false,
    scheduledShifts: []
  }),
  computed: {
    ...mapGetters({
      contracts: "contract/contracts",
      selectedContract: "selectedContract"
    }),
    isNewShift() {
      return this.uuid === null;
    },
    isRunningShift() {
      return isWithinInterval(new Date(), {
        start: this.shift.date.start,
        end: this.shift.date.end
      });
    },
    contractEndDate() {
      return this.contract.date.end;
    },
    shiftStart() {
      return localizedFormat(this.shift.date.start, "yyyy-MM-dd");
    },
    shiftExported() {
      return this.shift.locked;
    },
    startsInFuture() {
      return isFuture(this.shift.date.start);
    },
    tags() {
      return this.shift.tags.join(", ");
    },
    contract() {
      return new Contract(
        this.contracts.find((contract) => contract.uuid === this.shift.contract)
      );
    },
    valid() {
      if (
        isAfter(this.shift.date.start, this.shift.date.end) ||
        isBefore(this.shift.date.end, this.shift.date.start) ||
        isEqual(this.shift.date.start, this.shift.date.end) ||
        (!this.shift.reviewed && !this.startsInFuture && !this.isNewShift)
      )
        return false;

      return true;
    },
    startError() {
      return isEqual(this.shift.date.start, this.shift.date.end);
    },
    endError() {
      return (
        isBefore(this.shift.date.end, this.shift.date.start) ||
        isEqual(this.shift.date.start, this.shift.date.end)
      );
    }
  },
  watch: {
    "shift.contract": function () {
      this.setStartDate();
    },
    "shift.date": {
      handler: function () {
        // When updating the shift, check if we have to unreview the shift. A
        // shift starting in the future cannot be set to `was_reviewed=true`.
        if (!this.toBeReviewed) {
          this.handleReview();
        }
      },
      deep: true
    },
    shift: {
      handler: function () {
        this.$emit("update", { shift: this.shift, valid: this.valid });
      },
      deep: true
    },
    scheduledShifts() {
      this.$emit("update", {
        shift: this.shift,
        scheduledShifts: this.scheduledShifts,
        valid: this.valid
      });
    }
  },
  created() {
    this.shift = this.isNewShift ? this.initializeForm() : this.entity;

    if (!this.shift.contract) {
      this.shift.contract = this.$route.params.contract;
    }
    if (!this.startsInFuture && !this.shift.reviewed && !this.isNewShift) {
      this.toBeReviewed = true;
    }
  },
  methods: {
    setScheduledShifts(shifts) {
      this.scheduledShifts = shifts;
      if (this.scheduledShifts.length > 0) {
        this.scheduledShifts.forEach((shift) => {
          isFuture(shift.date.start)
            ? (shift.reviewed = false)
            : (shift.reviewed = true);
        });
      }
    },
    handleReview() {
      this.startsInFuture
        ? (this.shift.reviewed = false)
        : (this.shift.reviewed = true);
    },
    initializeForm() {
      return new Shift({
        date: { ...startEndHours(this.now) },
        contract: null,
        type: "st"
      });
    },
    reviewMessage() {
      if (this.isRunningShift && this.startsInFuture) {
        return this.$t("shifts.reviewErrorLive");
      } else if (!this.shift.reviewed && !this.showRepeat) {
        return !this.startsInFuture
          ? this.$t("shifts.reviewErrorPast")
          : this.$t("shifts.reviewErrorFuture");
      }
    },
    setStartDate() {
      const contractStart = this.contract.date.start;
      const contractEnd = this.contract.date.end;
      const now = this.now;

      // If we go too fast, contractStart is null and we get an error.
      // Gotta go fast.
      if (contractStart === null || contractEnd === null) return;

      // Do nothing if current date is inside the
      // selected contract
      if (
        (isBefore(new Date(contractStart), this.shift.date.start) &&
          isAfter(new Date(contractEnd), this.shift.date.end)) ||
        isSameDay(new Date(contractStart), this.shift.date.start) ||
        isSameDay(new Date(contractEnd), this.shift.date.end)
      ) {
        return;
      }

      // Always set Date.now(), if today is inbetween the
      // start and end date of a contract.
      if (
        isBefore(new Date(contractStart), now) &&
        isAfter(new Date(contractEnd), now)
      ) {
        this.shift.setToday();
        return;
      }

      const [year, month, day] = contractStart.split("-");
      this.shift.setDate(...[year, month - 1, day], "start");
      this.shift.setDate(...[year, month - 1, day], "end");
    }
  }
};
</script>
