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
        v-model="data"
        :prepend-icon="prependIcon"
        :label="label"
        :hint="hint"
        persistent-hint
        filled
        required
        background-color="blue lighten-5"
        :error-messages="timeErrors"
        v-bind="attrs"
        @blur="setTime"
        @focus="$event.target.select()"
      ></v-text-field>
    </template>
  </v-menu>
</template>

<script>
import { validateWorktimeInput } from "@/utils/time";
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
      type: String,
      default: ""
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
    time: {
      get() {
        return this.value;
      },
      set(val) {
        let hours, minutes;

        try {
          [hours, minutes] = validateWorktimeInput(val).split(":");
        } catch {
          this.data = this.value;
          return;
        }
        this.data = `${hours}:${minutes}`;
        this.$emit("input", this.data);
      }
    },
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

  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      this.value == null ? (this.data = "") : (this.data = this.value);
    },
    setTime() {
      this.$refs.menu.save(this.time);
      this.time = this.data;
      this.$v.data.$touch();
    }
  }
};
</script>
