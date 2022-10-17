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
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import { mdiTimetable, mdiCalendarClock } from "@mdi/js";

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
  mixins: [validationMixin],
  validations: {
    data: {
      required,
      timeNotZero,
      timeValid,
      timeNotNegative
    }
  },
  props: {
    value: {
      type: Number,
      default: 0
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
  data: () => ({
    menu: false,
    data: null,
    icons: { mdiTimetable, mdiCalendarClock }
  }),
  computed: {
    timeErrors() {
      const errors = [];
      if (!this.$v.data.$dirty) return errors;
      !this.$v.data.required &&
        errors.push(
          this.$tc("errors.nameRequired", 1, {
            name: this.$t("errors.hours")
          })
        );
      // skip that one as it yet interferes with the versatile parser
      // the parser should not return invalid worktimes although it is less transparent
      // !this.$v.data.timeValid && errors.push(this.$t("errors.timeFormat"));
      !this.allowNegativeValues &&
        !this.$v.data.timeNotNegative &&
        errors.push(this.$t("errors.notNegative"));
      !this.$v.data.timeNotZero &&
        errors.push(
          this.$t("errors.durationBiggerZero", {
            name: this.$tc("errors.hours")
          })
        );
      return errors;
    }
  },
  watch: {
    value(val) {
      this.data = val === 0 ? "" : minutesToHHMM(val);
    }
  },
  created() {
    this.data = this.value === 0 ? "" : minutesToHHMM(this.value);
  },
  methods: {
    setTime() {
      this.$refs.menu.save(this.time);
      this.time = this.data;
      this.$v.data.$touch();
    },
    updateData(event) {
      console.log(event, this.data);
      let minutes = 0;
      try {
        minutes = validateWorktimeInput(event);
        console.log(minutes);
      } catch {
        if (event === "") {
          this.$emit("input", 0);
          return;
        }
      }

      this.$emit("input", minutes);
    }
  }
};
</script>
