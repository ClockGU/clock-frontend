<template>
  <v-text-field
    :value="data"
    :prepend-icon="prependIcon"
    :label="label"
    :hint="hint"
    :disabled="disabled"
    persistent-hint
    filled
    required
    :error-messages="timeErrors"
    @blur="updateData($event.target.value)"
  ></v-text-field>
</template>

<script>
import { minutesToHHMM, validateWorktimeInput } from "@/utils/time";
import { required, helpers } from "@vuelidate/validators";
import { mdiCalendarClock, mdiTimetable } from "@mdi/js";
import { useVuelidate } from "@vuelidate/core";

const timeNotZero = (value) => !helpers.req(value) || value !== "00:00";
const timeValid = (value) => {
  try {
    return !helpers.req(value) || value.split(":")[1] <= parseInt(59);
  } catch {
    return false;
  }
};

export default {
  name: "ContractFormTimeInput",
  validations() {
    let validations = {
      data: {
        timeNotZero: helpers.withMessage(
          this.$t("errors.durationBiggerZero", {
            name: this.$tc("errors.hours")
          }),
          timeNotZero
        ),
        timeValid: helpers.withMessage(this.$t("errors.timeFormat"), timeValid)
      }
    };
    if (this.required) {
      validations.data.required = helpers.withMessage(
        this.$tc("errors.nameRequired", 1, { name: this.$t("errors.hours") }),
        required
      );
    }
    return validations;
  },
  props: {
    value: {
      type: [Number, String],
      default: null
    },
    prependIcon: {
      type: String,
      default: ""
    },
    label: {
      type: String,
      default: ""
    },
    hint: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    return {
      v$: useVuelidate()
    };
  },
  data() {
    return {
      menu: false,
      data: null,
      icons: {
        mdiTimetable,
        mdiCalendarClock
      }
    };
  },
  computed: {
    timeErrors() {
      let errors = [];
      if (!this.v$.data.$dirty) return errors;
      if (this.v$.data.$error) {
        for (let error of this.v$.data.$errors) {
          errors.push(error.$message);
        }
      }
      return errors;
    }
  },
  watch: {
    value(val) {
      try {
        validateWorktimeInput(minutesToHHMM(val));
      } catch {
        this.data = val;
        return;
      }
      this.data = val === null ? "" : minutesToHHMM(val);
    }
  },
  created() {
    this.data = this.value === 0 ? null : minutesToHHMM(this.value);
  },
  methods: {
    setTime() {
      this.$refs.menu.save(this.time);
      this.time = this.data;
      this.v$.data.$touch();
    },
    updateData(event) {
      let minutes = 0;
      this.v$.data.$touch();
      try {
        minutes = validateWorktimeInput(event);
      } catch {
        if (event === "") {
          this.$emit("input", null);
          return;
        }
        this.$emit("input", event);
        return;
      }
      this.$emit("input", minutes);
    }
  }
};
</script>
