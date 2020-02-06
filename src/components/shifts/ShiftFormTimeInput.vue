<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-model="data"
        :data-time-value="data"
        :data-cy="type"
        return-masked-value
        hide-details
        filled
        dense
        mask="time"
        :readonly="$vuetify.breakpoint.smAndDown"
        :prepend-icon="prependIcon ? icons.mdiClockOutline : ''"
        @click:append="clickAppend"
        @blur="setTime"
        v-on="$vuetify.breakpoint.smAndDown ? on : ''"
      ></v-text-field>
    </template>
    <v-time-picker
      v-if="$vuetify.breakpoint.smAndDown"
      v-model="data"
      format="24hr"
      @click:minute="setTime"
    ></v-time-picker>
  </v-menu>
</template>

<script>
import { format } from "date-fns";
import { Shift } from "@/models/ShiftModel";

import { mdiClockOutline } from "@mdi/js";

function validHourMinute(value) {
  let hour, minute;

  try {
    [hour, minute] = value.split(":");
  } catch (error) {
    return false;
  }

  return Number.isInteger(parseInt(hour)) && Number.isInteger(parseInt(minute));
}

export default {
  name: "ShiftFormTimeInput",
  props: {
    value: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    errors: {
      type: Array,
      default: () => []
    },
    label: {
      type: String,
      default: ""
    },
    prependIcon: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    menu: false,
    data: null,
    opposites: {
      start: "end",
      end: "start"
    },
    icons: { mdiClockOutline }
  }),
  computed: {
    time: {
      get() {
        return format(this.value.date[this.type], "HH:mm");
      },
      set(val) {
        // User deleted all input or invalidated the input completely
        if (!validHourMinute(val)) {
          this.data = format(this.value.date[this.type], "HH:mm");
          return;
        }

        // Grab year, month and day from date entry
        const [year, month, day] = format(
          this.value.date[this.type],
          "yyyy-MM-dd"
        ).split("-");
        let [hours, minutes] = val.split(":");

        // Normalize hours to double digits
        if (parseInt(hours) < 10 && hours.length < 2) {
          hours = `0${hours}`;
        }
        // Normalize minutes to double digits
        if (parseInt(minutes) < 10 && minutes.length < 2) {
          // Append zero after number, if we stay below 60
          if (parseInt(`${minutes}0`) < 60) {
            minutes = `${minutes}0`;
          } else {
            minutes = `0${minutes}`;
          }
        }

        // Manually reset hours and minutes to valid values
        if (parseInt(hours) > 23) {
          hours = 23;
        }
        if (parseInt(minutes) > 59) {
          minutes = 59;
        }

        const date = new Date(year, month - 1, day, hours, minutes);

        const newValue = { ...this.value };
        newValue.date[this.type] = date;
        const shift = new Shift({ ...newValue });

        this.$emit("input", shift);
        this.data = `${hours}:${minutes}`;
      }
    }
  },
  created() {
    this.data = format(this.value.date[this.type], "HH:mm");
  },
  methods: {
    clickAppend() {
      // Make sure to remove blur from the input, before opening the dialog.
      // Otherwise, only an overlay is shown.
      // TODO: We blur the activeElement from the document, instead of the input here,
      // because we did not get it to work quickly.
      document.activeElement.blur();
      this.$nextTick(() => {
        this.dialog = true;
      });
    },
    setTime() {
      this.$refs.menu.save(this.time);
      this.time = this.data;
      this.$emit("update");

      if (this.dialog) {
        this.dialog = false;
      }
    }
  }
};
</script>
