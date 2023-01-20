<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
  >
    <template #activator="{ attrs }">
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
        v-bind="attrs"
        @blur="setTime"
        @focus="$event.target.select()"
        @focusout="updateData($event.target.value)"
      ></v-text-field>
    </template>
  </v-menu>
</template>

<script>
import { minutesToHHMM, validateWorktimeInput } from "@/utils/time";
import { required, helpers } from "@vuelidate/validators";
import { mdiCalendarClock, mdiTimetable } from "@mdi/js";
import { useVuelidate } from "@vuelidate/core";

const timeNotZero = (value) => value !== "00:00";
const timeValid = (value) => {
  try {
    return value.split(":")[1] <= parseInt(59);
  } catch {
    return false;
  }
};
const timeNotNegative = (value) => {
  if (value.includes(",")) {
    try {
      return parseFloat(value) >= 0;
    } catch {
      return false;
    }
  } else {
    try {
      return value.split(":")[0] >= 0;
    } catch {
      return false;
    }
  }
};

export default {
  name: "ContractFormTimeInput",
  validations() {
    return {
      data: {
        required: helpers.withMessage(
          this.$tc("errors.nameRequired", 1, { name: this.$t("errors.hours") }),
          required
        ),
        timeNotZero: helpers.withMessage(
          this.$t("errors.durationBiggerZero", {
            name: this.$tc("errors.hours")
          }),
          timeNotZero
        ),
        timeValid: helpers.withMessage(this.$t("errors.timeFormat"), timeValid),
        timeNotNegative: helpers.withMessage(
          this.$t("errors.notNegative"),
          timeNotNegative
        )
      }
    };
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
    allowNegativeValues: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    return {
      v$: useVuelidate()
    };
  },
  data: () => ({
    menu: false,
    data: null,
    icons: { mdiTimetable, mdiCalendarClock }
  }),
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
        console.log("caught");
        this.data = val;
        return;
      }
      this.data = val === null ? "" : minutesToHHMM(val);
      console.log("updated", this.data);
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
      try {
        minutes = validateWorktimeInput(event);
        console.log(minutes);
      } catch {
        if (event === "") {
          this.$emit("input", null);
          return;
        }
        console.log("here");
        this.$emit("input", event);
        return;
      }
      this.$emit("input", minutes);
    }
  }
};
</script>
