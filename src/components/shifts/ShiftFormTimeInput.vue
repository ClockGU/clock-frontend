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
// import { addMinutes, isTomorrow, setHours, setMinutes } from "date-fns";
import { localizedFormat } from "@/utils/date";
import { validateTimeInput } from "@/utils/time";

import { mdiClockOutline } from "@mdi/js";

export default {
  name: "ShiftFormTimeInput",
  props: {
    value: {
      type: Date,
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
  data() {
    return {
      menu: false,
      data: null,
      opposites: { start: "end", end: "start" },
      icons: {
        mdiClockOutline
      },
      time: this.value
    };
  },
  watch: {
    value(val) {
      this.time = localizedFormat(val, "HH:mm");
    },
    time(val) {
      if (val === "now" || val === "jetzt") {
        val = localizedFormat(new Date(), "HH:mm");
      }

      let hours, minutes;

      try {
        [hours, minutes] = validateTimeInput(val).split(":");
      } catch {
        this.data = localizedFormat(this.value, "HH:mm");
        return;
      }
      // Grab year, month and day from date entry
      const [year, month, day] = [
        this.value.getFullYear(),
        this.value.getMonth(),
        this.value.getDate()
      ];
      const date = new Date(year, month, day, hours, minutes);
      this.$emit("input", date);
      this.data = `${hours}:${minutes}`;
    }
  },
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      this.data = localizedFormat(this.value, "HH:mm");
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
