<template>
  <v-card-text>
    <ContractDurationInput
      v-model:start-date="contract.startDate"
      v-model:end-date="contract.endDate"
      :disable-start="areLockedShiftsInThisContract"
    ></ContractDurationInput>
    <v-row align="center" justify="start">
      <v-col cols="12">
        <ContractWorktimeModelInput
          v-model="contract.worktimeModelName"
          :disabled="contract.id !== ''"
        ></ContractWorktimeModelInput>
      </v-col>
      <v-col v-show="contract.worktimeModelName !== null" cols="12">
        <ContractFormTimeInput
          v-if="contract.worktimeModelName === 'studEmp'"
          v-model="contract.minutes"
          :prepend-icon="icons.mdiTimetable"
          :label="worktimeLabel"
          :hint="worktimeHint"
          :disabled="areLockedShiftsInThisContract"
          :required="contract.worktimeModelName === 'studEmp'"
        />
        <ContractPercentFteInput
          v-else
          v-model="contract.percentFte"
          :required="contract.worktimeModelName !== 'studEmp'"
        ></ContractPercentFteInput>
      </v-col>
      <v-col cols="12">
        <ContractNameInput v-model="contract.name"></ContractNameInput>
      </v-col>
      <v-col>
        <ReferenceInput v-model="contract.reference"></ReferenceInput>
      </v-col>
      <v-col cols="12">
        <ContractColorInput v-model="contract.color"></ContractColorInput>
      </v-col>
      <v-col cols="12" class="pa-0">
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
          :disabled="areLockedShiftsInThisContract || contractInFuture"
          :hint="contractInFutureHint"
          persistent-hint
          :error-messages="
            areLockedShiftsInThisContract
              ? $t('contracts.carryover.locked')
              : ''
          "
          @update:model-value="contract.initialCarryoverMinutes *= !$event"
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
        <v-checkbox
          v-model="showVacationCarryover"
          :label="$t('contracts.vacationCarryover.checkboxLabel')"
          :disabled="areLockedShiftsInThisContract"
          :error-messages="
            false ? $t('contracts.vacationCarryover.locked') : ''
          "
          @update:model-value="
            contract.initialVacationCarryoverMinutes *= !$event
          "
        ></v-checkbox>
        <v-expand-transition hide-on-leave mode="in">
          <div v-show="showVacationCarryover">
            <p v-show="!areLockedShiftsInThisContract">
              {{ $t("contracts.vacationCarryover.info") }}
            </p>
            <ContractFormTimeInput
              v-model="contract.initialVacationCarryoverMinutes"
              :prepend-icon="icons.mdiCalendarClock"
              :label="$t('contracts.vacationCarryover.timeLabel')"
              :hint="$t('contracts.vacationCarryover.timeSubtitle')"
              allow-negative-values
              :disabled="areLockedShiftsInThisContract"
              :required="showVacationCarryover"
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
import ContractColorInput from "@/components/contracts/ContractColorInput.vue";
import { isFuture } from "date-fns";
import ContractWorktimeModelInput from "@/components/contracts/ContractWorktimeModelInput.vue";
import ContractPercentFteInput from "@/components/contracts/ContractPercentFteInput.vue";
import ReferenceInput from "@/components/contracts/ReferenceInput.vue";

export default {
  name: "ContractFormFields",
  components: {
    ReferenceInput,
    ContractPercentFteInput,
    ContractWorktimeModelInput,
    ContractColorInput,
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
  emits: ["update:modelValue"],
  data() {
    return {
      contract: this.modelValue,
      icons: {
        mdiFolderInformationOutline,
        mdiTimetable,
        mdiCalendar,
        mdiCalendarClock
      },
      showCarryover: this.modelValue.initialCarryoverMinutes !== 0,
      showVacationCarryover:
        this.modelValue.initialVacationCarryoverMinutes !== 0
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
    },
    contractInFuture() {
      return isFuture(this.contract.startDate);
    },
    contractInFutureHint() {
      if (this.contractInFuture)
        return this.$t("contracts.carryover.contractInFuture");
      return "";
    }
  },
  watch: {
    modelValue(value) {
      this.contract = value;
      if (value.initialCarryoverMinutes === 0) {
        this.showCarryover = false;
      }
      if (value.initialVacationCarryoverMinutes === 0) {
        this.showVacationCarryover = false;
      }
    },
    contract(value) {
      this.$emit("update:modelValue", value);
    }
  },
  methods: {
    setInitialCarryover(event) {
      this.contract.initialCarryoverMinutes = event.carryover;
      this.contract.carryoverTargetDate = event.carryoverTargetDate;
    }
  }
};
</script>

<style scoped></style>
