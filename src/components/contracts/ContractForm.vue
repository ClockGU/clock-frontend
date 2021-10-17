<template>
  <v-form>
    <v-alert
      v-if="firstShiftOfContract !== null"
      data-cy="alert-step-one"
      type="info"
    >
      {{ $t("contracts.disableDateChangeInfo") }}
    </v-alert>
    <v-alert
      v-if="specificContractExpired(contract)"
      data-cy="alert-step-one"
      type="warning"
    >
      {{ $t("contracts.expiredVerbose") }}
    </v-alert>
    <v-row align="center" justify="start">
      <v-col cols="12" md="5">
        <ContractFormDateInput
          v-model="startDate"
          :max="firstShiftOfContract"
          :contract="contract"
          type="start"
        />
      </v-col>

      <v-col v-if="$vuetify.breakpoint.mdAndUp" cols="2" class="text-center">
        {{ $t("contracts.to") }}
      </v-col>

      <v-col cols="12" md="5">
        <ContractFormDateInput
          v-model="endDate"
          :min="lastShiftOfContract"
          :max="maxEndDate"
          :contract="contract"
          type="end"
        />
      </v-col>

      <v-col cols="12">
        <ContractFormTimeInput
          v-model="contract.worktime"
          :prepend-icon="icons.mdiTimetable"
          :label="$t('contracts.hoursPerMonth')"
          :hint="$t('contracts.hoursPerMonthSubtitle')"
        />
      </v-col>

      <v-col cols="12">
        <v-text-field
          v-model="contract.name"
          data-cy="input-contract"
          :label="$t('contracts.name')"
          :error-messages="nameErrors"
          :prepend-icon="icons.mdiFolderInformationOutline"
          filled
          counter="100"
          required
          @blur="$v.contract.name.$touch()"
        />
      </v-col>

      <v-col cols="12">
        <v-checkbox
          v-model="carryover"
          :disabled="shiftsLocked"
          :label="$t('contracts.carryover.checkboxLabel')"
          :error-messages="shiftsLocked ? $t('contracts.carryover.locked') : ''"
        ></v-checkbox>

        <ContractFormTimeInput
          v-if="carryover"
          v-model="contract.carryoverTime"
          :prepend-icon="icons.mdiCalendarClock"
          :label="$t('contracts.carryover.timeLabel')"
          :hint="$t('contracts.carryover.timeSubtitle')"
          allow-negative-values
          :disabled="shiftsLocked"
        />
        <v-menu
          v-if="carryover"
          v-model="carryoverDateMenu"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template #activator="{ on, attrs }">
            <v-text-field
              v-model="carryoverTargetDate"
              :label="$t('contracts.carryover.dateLabel')"
              :prepend-icon="icons.mdiCalendar"
              :disabled="shiftsLocked"
              readonly
              filled
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>

          <v-date-picker
            v-model="contract.carryoverTargetDate"
            type="month"
            :disabled="shiftsLocked"
            :show-current="false"
            :min="carryoverMinimalDate"
            :max="carryoverMaximalDate"
            @input="carryoverDateMenu = false"
          ></v-date-picker>
        </v-menu>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import { Contract } from "@/models/ContractModel";
import ContractFormDateInput from "@/components/contracts/ContractFormDateInput";
import ContractFormTimeInput from "@/components/contracts/ContractFormTimeInput";

import {
  addMonths,
  format,
  startOfMonth,
  endOfMonth,
  isAfter,
  parseISO
} from "date-fns";
import { localizedFormat } from "@/utils/date";
import { validationMixin } from "vuelidate";
import contractExpiredMixin from "@/mixins/contractExpired";
import { required, maxLength, minLength } from "vuelidate/lib/validators";
import {
  mdiCalendar,
  mdiCalendarClock,
  mdiTimetable,
  mdiFolderInformationOutline
} from "@mdi/js";

import { mapGetters } from "vuex";

export default {
  name: "ContractForm",
  filters: {
    formatDate(date) {
      return localizedFormat(parseISO(date), "yyyy-MM-dd");
    }
  },
  components: { ContractFormDateInput, ContractFormTimeInput },
  mixins: [contractExpiredMixin, validationMixin],
  validations: {
    contract: {
      name: { required, maxLength: maxLength(100), minLength: minLength(2) }
    }
  },
  props: {
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
      mdiFolderInformationOutline,
      mdiTimetable,
      mdiCalendar,
      mdiCalendarClock
    },
    contract: null,
    carryover: false,
    carryoverDateMenu: false,
    carryoverCache: null
  }),

  computed: {
    ...mapGetters({
      shifts: "shift/shifts"
    }),
    carryoverMinimalDate() {
      return this.contract.date.start;
    },
    carryoverMaximalDate() {
      return this.contract.date.end;
    },
    carryoverTargetDate() {
      return localizedFormat(
        parseISO(this.contract.carryoverTargetDate),
        "MMMM yyyy"
      );
    },
    sortedShifts() {
      const shifts = this.shifts.filter(
        (shift) => shift.contract === this.entity.uuid
      );
      return shifts.sort((a, b) => {
        return new Date(a.date.start) - new Date(b.date.start);
      });
    },
    shiftsLocked() {
      const shifts = this.shifts.filter(
        (shift) => shift.contract === this.entity.uuid && shift.locked == true
      );
      return shifts.length > 0;
    },
    lastShiftOfContract() {
      if (this.sortedShifts.length < 1) return this.startDate;

      return format(
        new Date(this.sortedShifts[this.sortedShifts.length - 1].date.start),
        "yyyy-MM-dd"
      );
    },
    firstShiftOfContract() {
      if (this.sortedShifts.length < 1) return null;

      return format(new Date(this.sortedShifts[0].date.start), "yyyy-MM-dd");
    },
    valid() {
      if (this.nameErrors.length > 0 || this.contract.name === null) {
        return false;
      }

      return true;
    },
    initialData() {
      const startDate = localizedFormat(startOfMonth(new Date()), "yyyy-MM-dd");

      return new Contract({
        name: null,
        date: {
          start: startDate,
          end: localizedFormat(endOfMonth(new Date()), "yyyy-MM-dd")
        },
        carryoverTargetDate: startDate,
        carryoverTime: null,
        worktime: null
      });
    },
    startDate: {
      get() {
        return localizedFormat(parseISO(this.contract.start), "yyyy-MM-dd");
      },
      set(val) {
        const [year, month, day] = val.split("-");

        const date = new Date(year, month - 1, day, 0, 0);
        this.contract.start = localizedFormat(date, "yyyy-MM-dd");

        // Update the carryoverTargetDate to the contract start, if we do not
        // want to carry over anything
        if (!this.carryover) {
          this.contract.carryoverTargetDate = format(
            startOfMonth(parseISO(this.contract.start)),
            "yyyy-MM-dd"
          );
        }

        // Update the carryoverTargetDate if we move the start month beyond the
        // previous value
        if (isAfter(date, parseISO(this.contract.carryoverTargetDate))) {
          this.contract.carryoverTargetDate = format(date, "yyyy-MM-dd");
        }

        if (isAfter(date, parseISO(this.contract.end))) {
          this.contract.end = localizedFormat(endOfMonth(date), "yyyy-MM-dd");
        }
      }
    },
    endDate: {
      get() {
        return localizedFormat(parseISO(this.contract.end), "yyyy-MM-dd");
      },
      set(val) {
        const [year, month, day] = val.split("-");
        this.contract.end = localizedFormat(
          new Date(year, month - 1, day, 0, 0),
          "yyyy-MM-dd"
        );
      }
    },
    nameErrors() {
      const errors = [];
      if (!this.$v.contract.name.$dirty) return errors;
      !this.$v.contract.name.minLength &&
        errors.push(
          this.$t("errors.minLength", {
            name: this.$t("errors.contractName"),
            length: 2
          })
        );
      !this.$v.contract.name.maxLength &&
        errors.push(
          this.$t("errors.maxLength", {
            name: this.$t("errors.contractName"),
            length: 100
          })
        );

      !this.$v.contract.name.required &&
        errors.push(
          this.$tc("errors.nameRequired", 1, {
            name: this.$t("errors.contractName")
          })
        );
      return errors;
    }
  },
  watch: {
    contract: {
      handler: function () {
        this.$emit("update", { contract: this.contract, valid: this.valid });
      },
      deep: true
    },
    carryover(val) {
      console.log(val, this.contract.carryoverTime);
      //do some stunts since the state is directly used by the FormDialog upon saving
      //TODO: Look for a more elegant way to do this
      if (val && this.carryoverCache == null) {
        //Save the actual value to the Cache if the Cache is empty (base state)
        this.carryoverCache = this.contract.carryoverTime;
      } else if (val && this.carryoverCache != null) {
        //take the cached vaule if the checkbox is reactivated
        this.contract.carryoverTime = this.carryoverCache;
      } else {
        //set carryoverTime to 00:00 if carryover-checkbox is deactivated
        this.contract.carryoverTime = "00:00";
      }
    }
  },
  created() {
    if (this.uuid === null) {
      // We are creating a new contract. We do not need to set a maximal end
      // date.
      this.contract = this.initialData;
      //TODO: set maxEndDate to 6 months or end of Semester
      this.maxEndDate = null;
    } else {
      // We are updating an existing contract. The latest end date is in six
      // months.
      this.contract = this.entity;
      const currentEndDate = parseISO(this.entity.date.end);
      this.maxEndDate = format(addMonths(currentEndDate, 6), "yyyy-MM-dd");
    }

    if (this.contract.carryoverTime !== "") {
      this.carryover = true;
    }
  }
};
</script>
