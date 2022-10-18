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
        <span> {{ contract.name }}</span>
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

export default {
  name: "ContractFormFields",
  components: {
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
      }
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
    },
    contract(value) {
      this.$emit("input", value);
    }
  },
  methods: {
    setDates(event) {
      this.contract.startDate = event.startDate;
      this.contract.endDate = event.endDate;
    }
  }
};
</script>

<style scoped></style>
