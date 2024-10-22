<template>
    <v-row align="center" justify="start">
      <v-col cols="12" md="5">
        <ShiftFormDateInput
          :model-value="date"
          data-cy="shift-date"
          :min="dateMin"
          :max="dateMax"
          label="Date"
          @update:model-value="setDate"
        />
      </v-col>

      <v-col cols="6" md="3">
        <ShiftFormTimeInput
          v-bind="props"
          v-model="timeStart"
          :error-messages="errors"
          :error="errors.length > 0"
          :prepend-icon="smAndDown"
          @update:model-value="$emit('update:started', $event); v$.timeStart.$touch()"
          @blur="v$.timeStart.$touch()"
        />
      </v-col>

      <v-col cols="1" class="px-0 text-center">
        {{ $t("shifts.to") }}
      </v-col>

      <v-col cols="5" md="3">
        <ShiftFormTimeInput
          v-model="timeStop"
          :error="errors.length > 0"
          @update:model-value="$emit('update:stopped', $event); v$.timeStart.$touch()"
          @blur="v$.timeStart.$touch()"
        />
      </v-col>
    </v-row>
</template>

<script>
import { mapGetters } from "vuex";
import { formatISO, isSameMinute, subDays } from "date-fns";
import ShiftFormDateInput from "@/components/shifts/ShiftFormDateInput.vue";
import ShiftFormTimeInput from "@/components/shifts/ShiftFormTimeInput.vue";
import { useVuelidate } from "@vuelidate/core";
import { helpers } from "@vuelidate/validators";
function validStartTime(value) {
  console.log("validations called");
  console.log(!isSameMinute(this.timeStop, value));
  return !isSameMinute(this.timeStop, value)
}
export default {
  name: "ShiftFormDatetimeInput",
  components: { ShiftFormDateInput, ShiftFormTimeInput },
  props: {
    started: {
      type: Date,
      required: false,
      default: new Date()
    },
    stopped: {
      type: Date,
      required: false,
      default: new Date()
    },
    contractId: {
      type: String,
      required: true
    }
  },
  emits: ["update:started", "update:stopped"],
  setup() {
    return {
      v$: useVuelidate()
    };
  },
  validations() {
    return {
      timeStart: {
        validStartTime: helpers.withMessage(
          this.$t("shifts.errors.startedNotStopped"),
          validStartTime
        )
      }}
  },
  data() {
    return {
      date: this.started,
      timeStart: this.started,
      timeStop: this.stopped
    };
  },
  computed: {
    ...mapGetters({
      getContractInstance: "contentData/contractById",
      selectedContract: "selectedContract/selectedContract"
    }),
    errors() {
      return this.v$.$errors.map((item) => item.$message)
    },
    smAndDown() {
      return this.$vuetify.display.smAndDown;
    },
    contract() {
      if (this.contractId === "") return this.selectedContract;
      return this.getContractInstance(this.contractId);
    },
    dateMin() {
      return formatISO(subDays(this.contract.startDate, 1));
    },
    dateMax() {
      return formatISO(this.contract.endDate);
    }
  },
  watch: {
    started(val) {
      this.date = val;
      this.timeStart = val;
    },
    stopped(val) {
      this.timeStop = val;
    }
  },
  methods: {
    setDate(event) {
      this.date = event;
      const [year, month, day] = [
        this.date.getFullYear(),
        this.date.getMonth(),
        this.date.getDate()
      ];
      // Vue ONLY wraps GET and SET not all other modifcations... so setFullYear does not work
      // sadly ...
      this.$emit(
        "update:started",
        new Date(
          year,
          month,
          day,
          this.timeStart.getHours(),
          this.timeStart.getMinutes()
        )
      );
      this.$emit(
        "update:stopped",
        new Date(
          year,
          month,
          day,
          this.timeStop.getHours(),
          this.timeStop.getMinutes()
        )
      );
    }
  }
};
</script>
