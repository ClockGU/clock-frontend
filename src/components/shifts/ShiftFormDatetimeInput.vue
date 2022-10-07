<template>
  <div>
    <v-col cols="12" md="5">
      <ShiftFormDateInput
        :value="date"
        data-cy="shift-date"
        :min="dateMin"
        :max="dateMax"
        label="Date"
        @input="setDate"
      />
    </v-col>

    <v-col cols="6" md="3">
      <ShiftFormTimeInput
        v-model="timeStart"
        :prepend-icon="$vuetify.breakpoint.smAndDown"
      />
    </v-col>

    <v-col cols="1" class="px-0 text-center">
      {{ $t("shifts.to") }}
    </v-col>

    <v-col cols="5" md="3">
      <ShiftFormTimeInput v-model="timeStop" />
    </v-col>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { formatISO } from "date-fns";
import ShiftFormDateInput from "@/components/shifts/ShiftFormDateInput";
import ShiftFormTimeInput from "@/components/shifts/ShiftFormTimeInput";

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
    contract: {
      type: String,
      required: true
    }
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
      getContractInstance: "contentData/contractById"
    }),
    dateMin() {
      return formatISO(this.getContractInstance(this.contract).startDate);
    },
    dateMax() {
      return formatISO(this.getContractInstance(this.contract).endDate);
    }
  },
  watch: {
    started(val) {
      this.date = val;
      this.timeStart = val;
    },
    stopped(val) {
      this.timeStop = val;
    },
    timeStart() {
      this.input();
    },
    timeStop() {
      this.input();
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
      this.timeStart = new Date(
        year,
        month,
        day,
        this.timeStart.getHours(),
        this.timeStart.getMinutes()
      );
      this.timeStop = new Date(
        year,
        month,
        day,
        this.timeStop.getHours(),
        this.timeStop.getMinutes()
      );

      this.input();
    },
    input() {
      this.$emit("input", { started: this.timeStart, stopped: this.timeStop });
    }
  }
};
</script>

<style scoped></style>
