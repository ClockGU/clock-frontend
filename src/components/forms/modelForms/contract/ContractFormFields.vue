<template>
  <v-card-text>
    <ContractDurationInput
      :start-date="contract.startDate"
      :end-date="contract.endDate"
      :disable-start="areLockedShiftsInThisContract"
      @input="setDates"
    ></ContractDurationInput>
    <v-row align="center" justify="start">
      <v-col cols="12">
        <ContractFormTimeInput
          v-model="contract.minutes"
          :prepend-icon="icons.mdiTimetable"
          :label="worktimeLabel"
          :hint="worktimeHint"
          :disabled="areLockedShiftsInThisContract"
          required
        />
      </v-col>
      <v-col cols="12">
        <ContractNameInput v-model="contract.name"></ContractNameInput>
      </v-col>
      <v-col cols="12">
        <v-expand-transition hide-on-leave>
          <ClockCardAlert
            v-if="alertMessages.length > 0"
            :messages="alertMessages"
            :type="alertType"
          ></ClockCardAlert>
        </v-expand-transition>
      </v-col>
      <v-col cols="12">
        <v-checkbox
          v-model="showCarryover"
          :label="$t('contracts.carryover.checkboxLabel')"
          :disabled="areLockedShiftsInThisContract"
          :error-messages="false ? $t('contracts.carryover.locked') : ''"
        ></v-checkbox>
        <v-expand-transition hide-on-leave mode="in">
          <div v-show="showCarryover">
            <p v-show="!areLockedShiftsInThisContract">
              {{ $t("contracts.carryover.info") }}
            </p>
            <ContractFormTimeInput
              v-model="contract.initialCarryoverMinutes"
              :prepend-icon="icons.mdiCalendarClock"
              :label="$t('contracts.carryover.timeLabel')"
              :hint="$t('contracts.carryover.timeSubtitle')"
              allow-negative-values
              :disabled="areLockedShiftsInThisContract"
              :required="showCarryover"
            />
          </div>
        </v-expand-transition>
      </v-col>
    </v-row>
  </v-card-text>
</template>

<script>
import { Contract } from "@/models/ContractModel";
import ContractDurationInput from "@/components/contracts/ContractDurationInput.vue";
import ContractFormTimeInput from "@/components/contracts/ContractFormTimeInput.vue";
import {
  mdiCalendar,
  mdiCalendarClock,
  mdiFolderInformationOutline,
  mdiTimetable
} from "@mdi/js";
import ContractNameInput from "@/components/contracts/ContractNameInput.vue";
import ClockCardAlert from "@/components/ClockCardAlert.vue";
import store from "@/store";

export default {
  name: "ContractFormFields",
  components: {
    ContractNameInput,
    ContractDurationInput,
    ContractFormTimeInput,
    ClockCardAlert
  },
  props: {
    modelValue: {
      type: Contract,
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
emits: ['update:modelValue'],
  data() {
    return {
      contract: this.modelValue,
      icons: {
        mdiFolderInformationOutline,
        mdiTimetable,
        mdiCalendar,
        mdiCalendarClock
      },
      showCarryover: this.modelValue.initialCarryoverMinutes !== 0
    };
  },
  computed: {
    worktimeLabel() {
      return this.$t("contracts.hoursPerMonth");
    },
    worktimeHint() {
      return this.$t("contracts.hoursPerMonthSubtitle");
    },
    areLockedShiftsInThisContract() {
      let shifts = store.getters["contentData/allShifts"].filter((shift) => {
        return shift.contract === this.modelValue.id && shift.locked;
      });
      return shifts.length !== 0;
    }
  },
  watch: {
    modelValue(value) {
      this.contract = value;
      if (value.initialCarryoverMinutes === 0) {
        this.showCarryover = false;
      }
    },
    contract(value) {
      this.$emit("update:modelValue", value);
    }
  },
  methods: {
    setDates(event) {
      this.contract.startDate = event.startDate;
      this.contract.endDate = event.endDate;
    },
    setInitialCarryover(event) {
      this.contract.initialCarryoverMinutes = event.carryover;
      this.contract.carryoverTargetDate = event.carryoverTargetDate;
    }
  }
};
</script>

<style scoped></style>
