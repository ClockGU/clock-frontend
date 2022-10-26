<template>
  <v-card-text>
    <ContractDurationInput
      :start-date="contract.startDate"
      :end-date="contract.endDate"
      @input="setDates"
    ></ContractDurationInput>
    <v-row align="center" justify="start">
      <v-col cols="12">
        <ContractFormTimeInput
          v-model="contract.minutes"
          :prepend-icon="icons.mdiTimetable"
          :label="worktimeLabel"
          :hint="worktimeHint"
          :disabled="false"
        />
      </v-col>
      <v-col cols="12">
        <ContractNameInput v-model="contract.name"></ContractNameInput>
      </v-col>
      <v-col cols="12">
        <v-checkbox
          v-model="showCarryover"
          :label="$t('contracts.carryover.checkboxLabel')"
          :error-messages="false ? $t('contracts.carryover.locked') : ''"
        ></v-checkbox>
        <v-expand-transition hide-on-leave mode="in">
          <div v-show="showCarryover">
            <!-- The "key" prop is a hack to rerender the vuelidation logic after exiting the form -->
            <ContractFormCarryoverInput
              :carryover="contract.initialCarryoverMinutes"
              :carryover-target-date="contract.carryoverTargetDate"
              :max-date="contract.endDate"
              :min-date="contract.startDate"
              @input="setInitialCarryover"
            ></ContractFormCarryoverInput>
          </div>
        </v-expand-transition>
      </v-col>
    </v-row>
  </v-card-text>
</template>

<script>
import { Contract } from "@/models/ContractModel";
import ContractDurationInput from "@/components/contracts/ContractDurationInput";
import ContractFormTimeInput from "@/components/contracts/ContractFormTimeInput";
import {
  mdiCalendar,
  mdiCalendarClock,
  mdiFolderInformationOutline,
  mdiTimetable
} from "@mdi/js";
import ContractNameInput from "@/components/contracts/ContractNameInput";
import ContractFormCarryoverInput from "@/components/contracts/ContractFormCarryoverInput";

export default {
  name: "ContractFormFields",
  components: {
    ContractFormCarryoverInput,
    ContractNameInput,
    ContractDurationInput,
    ContractFormTimeInput
  },
  props: {
    value: {
      type: Contract,
      required: true
    }
  },
  data() {
    return {
      contract: this.value,
      icons: {
        mdiFolderInformationOutline,
        mdiTimetable,
        mdiCalendar,
        mdiCalendarClock
      },
      showCarryover: false
    };
  },
  computed: {
    worktimeLabel() {
      return this.$t("contracts.hoursPerMonth");
    },
    worktimeHint() {
      return this.$t("contracts.hoursPerMonthSubtitle");
    }
  },
  watch: {
    value(value) {
      this.contract = value;
      if (value.initialCarryoverMinutes === 0) {
        this.showCarryover = false;
      }
    },
    contract(value) {
      this.$emit("input", value);
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
