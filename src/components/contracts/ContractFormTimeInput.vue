<template>
  <label :for="label" class="ml-10" >{{ label }}</label>
  <v-text-field
    :id="label"
    v-model="time"
    :prepend-icon="prependIcon"
    :label="label"
    :hint="hint"
    :disabled="disabled"
    persistent-hint
    variant="filled"
    required
    :error-messages="timeErrors"
    @blur="updateTime($event.target.value)"
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
const timeNotNegative = (value) => {
  if (value === null) return true;
  let result;
  if (value.includes(",")) {
    try {
      result = parseFloat(value) >= 0;
    } catch {
      result = false;
    }
  } else {
    try {
      result = value.split(":")[0] >= 0;
    } catch {
      result = false;
    }
  }
  return !helpers.req(value) || result;
};

export default {
  name: "ContractFormTimeInput",
  validations() {
    let validations = {
      time: {
        timeNotZero: helpers.withMessage(
          this.$t("errors.durationBiggerZero", {
            name: this.$tc("errors.hours")
          }),
          timeNotZero
        ),
        timeValid: helpers.withMessage(this.$t("errors.timeFormat"), timeValid)
      }
    };
    if (!this.allowNegativeValues) {
      validations.time.timeNotNegative = helpers.withMessage(
        this.$t("errors.notNegative"),
        timeNotNegative
      );
    }
    if (this.required) {
      validations.time.required = helpers.withMessage(
        this.$tc("errors.nameRequired", 1, { name: this.$t("errors.hours") }),
        required
      );
    }
    return validations;
  },
  props: {
    modelValue: {
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
    allowNegativeValues: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    }
  },
  emits: ["update:modelValue"],
  setup() {
    return {
      v$: useVuelidate()
    };
  },
  data() {
    return {
      menu: false,
      time: null,
      icons: {
        mdiTimetable,
        mdiCalendarClock
      }
    };
  },
  computed: {
    timeErrors() {
      let errors = [];
      if (!this.v$.time.$dirty) return errors;
      if (this.v$.time.$error) {
        for (let error of this.v$.time.$errors) {
          errors.push(error.$message);
        }
      }
      return errors;
    }
  },
  watch: {
    modelValue(val) {
      try {
        validateWorktimeInput(minutesToHHMM(val));
      } catch {
        this.time = val;
        return;
      }
      this.time = val === 0 ? null : minutesToHHMM(val);
    },
    required() {
      this.v$.time.$touch();
    }
  },
  created() {
    this.time = this.modelValue === 0 ? null : minutesToHHMM(this.modelValue);
  },
  methods: {
    setTime() {
      this.$refs.menu.save(this.time);
      this.time = this.data;
      this.v$.data.$touch();
    },
    updateTime(event) {
      let minutes = 0;
      if (event[0] === "+") {
        this.time = event.substring(1);
        event = event.substring(1);
      }
      this.v$.time.$touch();
      try {
        minutes = validateWorktimeInput(event);
      } catch {
        if (event === "") {
          this.$emit("update:modelValue", 0);
          return;
        }
        this.$emit("update:modelValue", event);
        return;
      }
      this.$emit("update:modelValue", minutes);
    }
  }
};
</script>
