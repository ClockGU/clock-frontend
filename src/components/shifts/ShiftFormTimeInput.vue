<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
  >
    <template #activator="{ on, attrs }">
      <v-text-field
        v-model="data"
        :data-time-value="data"
        :data-cy="type"
        return-masked-value
        hide-details
        filled
        dense
        :error="error"
        mask="time"
        :readonly="$vuetify.breakpoint.smAndDown"
        :prepend-icon="prependIcon ? icons.mdiClockOutline : ''"
        v-bind="attrs"
        @blur="setTime"
        @focus="$event.target.select()"
        v-on="$vuetify.breakpoint.smAndDown ? on : ''"
      ></v-text-field>
    </template>
    <v-time-picker
      v-if="menu && $vuetify.breakpoint.smAndDown"
      v-model="data"
      format="24hr"
      @click:minute="setTime"
    ></v-time-picker>
  </v-menu>
</template>

<script>
import {
  addMinutes,
  format,
  // isBefore,
  isTomorrow,
  setHours,
  setMinutes
  // subMinutes
} from "date-fns";
import { localizedFormat } from "@/utils/date";
import { validateTimeInput } from "@/utils/time";

import { Shift } from "@/models/ShiftModel";

import { mdiClockOutline } from "@mdi/js";

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
    error: {
      type: Boolean,
      default: false
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
        return localizedFormat(this.value.date[this.type], "HH:mm");
      },
      set(val) {
        //function to set times to "now"
        if (val == "now" || val == "jetzt") {
          val = localizedFormat(new Date(), "HH:mm");
        }

        let hours, minutes;

        try {
          [hours, minutes] = validateTimeInput(val).split(":");
        } catch {
          this.data = localizedFormat(this.value.date[this.type], "HH:mm");
          return;
        }

        // Save the old duration and limit to a single days' worth of minutes
        const oldDuration = this.value.duration % 1440;

        // Grab year, month and day from date entry
        const [year, month, day] = localizedFormat(
          this.value.date[this.type],
          "yyyy-MM-dd"
        ).split("-");

        // Normalize hours to double digits
        // Normalize minutes to double digits

        // Manually reset hours and minutes to valid values

        const date = new Date(year, month - 1, day, hours, minutes);

        const newValue = { ...this.value };
        newValue.date[this.type] = date;

        // If we modified the startTime, then also shift the end time
        if (this.type === "start") {
          let newEnd = addMinutes(date, oldDuration);

          // Limit the end time at 23:59
          if (isTomorrow(newEnd)) {
            newEnd = setHours(newEnd, 23);
            newEnd = setMinutes(newEnd, 59);
          }

          newValue.date["end"] = newEnd;
        }

        const shift = new Shift({ ...newValue });

        this.$emit("input", shift);
        this.data = `${hours}:${minutes}`;
      }
    }
  },
  watch: {
    // When dynamically adapt the end time, when we change the start time, then
    // we also need to set `this.data` like we do in created().
    "value.date": {
      handler: function () {
        // Do nothing if we are editing the start time.
        if (this.type === "start") return;

        // Run initialize to set the initial value in the input
        this.initialize();
      },
      deep: true
    }
  },
  created() {
    this.initialize();
    this.data = localizedFormat(this.value.date[this.type], "HH:mm");
  },
  methods: {
    initialize() {
      this.data = format(this.value.date[this.type], "HH:mm");
    },
    setTime() {
      this.$refs.menu.save(this.time);
      this.time = this.data;

      if (this.dialog) {
        this.dialog = false;
      }
    }
  }
};
</script>
