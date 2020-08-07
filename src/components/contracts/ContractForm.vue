<template>
  <v-form>
    <v-alert
      v-if="firstShiftOfContract !== null"
      data-cy="alert-step-one"
      type="info"
    >
      {{ $t("contracts.disableDateChangeInfo") }}
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
        to
      </v-col>

      <v-col cols="12" md="5">
        <ContractFormDateInput
          v-model="endDate"
          :min="lastShiftOfContract"
          :contract="contract"
          type="end"
        />
      </v-col>

      <v-col cols="12">
        <v-text-field
          v-model="contract.worktime"
          data-cy="input-worktime"
          :label="$t('contracts.hoursPerMonth')"
          :hint="$t('contracts.hoursPerMonthSubtitle')"
          :prepend-icon="icons.mdiTimetable"
          return-masked-value
          persistent-hint
          required
          :error-messages="worktimeErrors"
          filled
          @blur="worktimeUpdated"
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
          :label="$t('contracts.carryover.checkboxLabel')"
        ></v-checkbox>

        <v-text-field
          v-if="carryover"
          v-model="contract.carryoverMinutes"
          :prepend-icon="icons.mdiCalendarClock"
          :label="$t('contracts.carryover.minutesLabel')"
          :error-messages="carryoverMinutesErrors"
          maxlength="6"
          required
          filled
          @blur="carryoverMinutesUpdated"
        >
        </v-text-field>

        <v-menu
          v-if="carryover"
          v-model="carryoverDateMenu"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="carryoverTargetDate"
              :label="$t('contracts.carryover.dateLabel')"
              :prepend-icon="icons.mdiCalendar"
              readonly
              filled
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>

          <v-date-picker
            v-model="contract.carryoverTargetDate"
            type="month"
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

import { format, startOfMonth, endOfMonth, isAfter, parseISO } from "date-fns";
import { validationMixin } from "vuelidate";
import { required, maxLength, minLength } from "vuelidate/lib/validators";
import {
  mdiCalendar,
  mdiCalendarClock,
  mdiTimetable,
  mdiFolderInformationOutline
} from "@mdi/js";

import { mapGetters } from "vuex";

const worktimeNotZero = value => value !== "00:00";
const validWorktime = value => {
  try {
    return value.split(":")[1] <= parseInt(59);
  } catch {
    return false;
  }
};
const validCarryoverMinutes = value => {
  return /^(-?)([0-9][0-9]):[0-5][0-9]$/.test(value);
};

export default {
  name: "ContractForm",
  filters: {
    formatDate(date) {
      return format(parseISO(date), "yyyy-MM-dd");
    }
  },
  components: { ContractFormDateInput },
  mixins: [validationMixin],
  validations: {
    contract: {
      name: { required, maxLength: maxLength(100), minLength: minLength(2) },
      carryoverMinutes: {
        required,
        validCarryoverMinutes,
        minLength: minLength(5),
        maxLength: maxLength(6)
      },
      worktime: {
        required,
        worktimeNotZero,
        validWorktime,
        minLength: minLength(5)
      }
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
    carryoverDateMenu: false
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
      return format(parseISO(this.contract.carryoverTargetDate), "MMMM yyyy");
    },
    sortedShifts() {
      const shifts = this.shifts.filter(
        shift => shift.contract === this.entity.uuid
      );
      return shifts.sort((a, b) => {
        return new Date(a.date.start) - new Date(b.date.start);
      });
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
      if (
        this.worktimeErrors.length > 0 ||
        this.nameErrors.length > 0 ||
        this.contract.name === null ||
        this.contract.worktime === null ||
        this.carryoverMinutesErrors.length > 0
      ) {
        return false;
      }

      return true;
    },
    initialData() {
      const startDate = format(startOfMonth(new Date()), "yyyy-MM-dd");

      return new Contract({
        name: null,
        date: {
          start: startDate,
          end: format(endOfMonth(new Date()), "yyyy-MM-dd")
        },
        carryoverTargetDate: startDate,
        carryoverMinutes: 0,
        worktime: null
      });
    },
    startDate: {
      get() {
        return format(parseISO(this.contract.start), "yyyy-MM-dd");
      },
      set(val) {
        const [year, month, day] = val.split("-");

        const date = new Date(year, month - 1, day, 0, 0);
        this.contract.start = format(date, "yyyy-MM-dd");

        if (isAfter(date, parseISO(this.contract.end))) {
          this.contract.end = format(endOfMonth(date), "yyyy-MM-dd");
        }
      }
    },
    endDate: {
      get() {
        return format(parseISO(this.contract.end), "yyyy-MM-dd");
      },
      set(val) {
        const [year, month, day] = val.split("-");
        this.contract.end = format(
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
    },
    worktimeErrors() {
      const errors = [];
      if (!this.$v.contract.worktime.$dirty) return errors;
      !this.$v.contract.worktime.required &&
        errors.push(
          this.$tc("errors.nameRequired", 1, {
            name: this.$t("errors.hours")
          })
        );
      !this.$v.contract.worktime.validWorktime &&
        errors.push(this.$t("errors.timeFormat"));
      !this.$v.contract.worktime.minLength &&
        errors.push(this.$t("errors.timeFormat"));
      !this.$v.contract.worktime.worktimeNotZero &&
        errors.push(
          this.$t("errors.durationBiggerZero", {
            entity: this.$tc("models.contract")
          })
        );

      return errors;
    },
    carryoverMinutesErrors() {
      const errors = [];
      if (!this.$v.contract.carryoverMinutes.$dirty) return errors;
      !this.$v.contract.carryoverMinutes.required &&
        errors.push(
          this.$tc("errors.nameRequired", 1, {
            name: this.$t("errors.hours")
          })
        );
      !this.$v.contract.carryoverMinutes.minLength &&
        errors.push(this.$t("errors.timeFormat"));
      !this.$v.contract.carryoverMinutes.maxLength &&
        errors.push(this.$t("errors.timeFormat"));
      !this.$v.contract.carryoverMinutes.validCarryoverMinutes &&
        errors.push(this.$t("errors.timeFormat"));

      return errors;
    }
  },
  watch: {
    contract: {
      handler: function() {
        this.$emit("update", { contract: this.contract, valid: this.valid });
      },
      deep: true
    }
  },
  created() {
    this.contract = this.uuid === null ? this.initialData : this.entity;

    if (this.contract.carryoverMinutes !== "00:00") {
      this.carryover = true;
    }
  },
  methods: {
    worktimeUpdated() {
      this.$v.contract.worktime.$touch();
      this.$emit("update", { contract: this.contract, valid: this.valid });
    },
    carryoverMinutesUpdated() {
      this.$v.contract.carryoverMinutes.$touch();
      this.$emit("update", { contract: this.contract, valid: this.valid });
    }
  }
};
</script>
