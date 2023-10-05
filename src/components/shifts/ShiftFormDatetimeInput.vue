<template>
  <div>
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
          v-model="timeStart"
          :error-messages="errors"
          :error="errors.length > 0"
          :prepend-icon="smAndDown"
          @update:model-value="$emit('update:started', $event);"
        />
      </v-col>

      <v-col cols="1" class="px-0 text-center">
        {{ $t("shifts.to") }}
      </v-col>

      <v-col cols="5" md="3">
        <ShiftFormTimeInput
          v-model="timeStop"
          :error="errors.length > 0"
          @update:model-value="$emit('update:stopped', $event);"
        />
      </v-col>
    </v-row>
    <v-row align="center" justify="start" class="ma-0">
      <v-col cols="12" class="pa-0">
        <v-tooltip
          :model-value="errors.length > 0"
          :open-on-hover="false"
          color="error"
          location="top"
          :nudge-bottom="45"
          :min-width="400"
          class="align-text-center"
        >
          <template #activator="{ props }">
            <v-spacer /><span v-bind="props"></span>
          </template>
          <div>{{ errors[0] }}</div>
        </v-tooltip>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { formatISO } from "date-fns";
import ShiftFormDateInput from "@/components/shifts/ShiftFormDateInput.vue";
import ShiftFormTimeInput from "@/components/shifts/ShiftFormTimeInput.vue";
import { useDisplay } from "vuetify";

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
    },
    errors: {
      type: Array,
      default: () => []
    }
  },
  emits: ["update:started", "update:stopped"],
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
    smAndDown() {
      const { smAndDown } = useDisplay();
      return smAndDown.value;
    },
    contract() {
      if (this.contractId === "") return this.selectedContract;
      return this.getContractInstance(this.contractId);
    },
    dateMin() {
      return formatISO(this.contract.startDate);
    },
    dateMax() {
      return formatISO(this.contract.endDate);
    }
  },
  watch: {
    started(val) {
      // this.date = val;
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
    },
  }
};
</script>

<style scoped>
:deep(.v-tooltip__content) {
  text-align: center;
}
</style>
