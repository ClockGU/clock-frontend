<template>
  <v-form>
    <v-alert v-if="disableDateChange" data-cy="alert-step-one" type="error">
      {{ $t("contracts.disableDateChangeAlert") }}
    </v-alert>

    <v-row align="center" justify="start">
      <v-col cols="12" md="5">
        <ContractFormDateInput
          v-model="startDate"
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
          :contract="contract"
          :min="startDate"
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
    </v-row>
  </v-form>
</template>

<script>
import { Contract } from "@/models/ContractModel";
import ContractFormDateInput from "@/components/contracts/ContractFormDateInput";

import { format, startOfMonth, endOfMonth, isAfter, parseISO } from "date-fns";
import { validationMixin } from "vuelidate";
import { required, maxLength, minLength } from "vuelidate/lib/validators";
import { mdiTimetable, mdiFolderInformationOutline } from "@mdi/js";

const worktimeNotZero = value => value !== "00:00";
const validWorktime = value => {
  try {
    return value.split(":")[1] <= parseInt(59);
  } catch {
    return false;
  }
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
    icons: { mdiFolderInformationOutline, mdiTimetable },
    contract: null
  }),

  computed: {
    valid() {
      if (
        this.worktimeErrors.length > 0 ||
        this.nameErrors.length > 0 ||
        this.contract.name === null ||
        this.contract.worktime === null
      ) {
        return false;
      }

      return true;
    },
    disableDateChange() {
      return (
        this.$store.state.shift.shifts.filter(
          shift => shift.contract === this.contract.uuid
        ).length > 0
      );
    },
    initialData() {
      return new Contract({
        name: null,
        date: {
          start: format(startOfMonth(new Date()), "yyyy-MM-dd"),
          end: format(endOfMonth(new Date()), "yyyy-MM-dd")
        },
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
            name: this.$t("errors.worktime")
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
  },
  methods: {
    worktimeUpdated() {
      this.$v.contract.worktime.$touch();
      this.$emit("update", { contract: this.contract, valid: this.valid });
    }
  }
};
</script>
