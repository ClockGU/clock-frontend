<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    :return-value.sync="time"
    transition="scale-transition"
    offset-y
    full-width
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-model="time"
        readonly
        prepend-inner-icon="access_time"
        v-on="on"
      ></v-text-field>
    </template>
    <v-time-picker
      v-if="menu"
      v-model="time"
      no-title
      format="24hr"
      :min="min"
      :max="max"
      @click:minute="$refs.menu.save(time)"
    ></v-time-picker>
  </v-menu>
</template>

<script>
import { format } from "date-fns";

export default {
  name: "ShiftFormTimeInput",
  props: {
    value: {
      type: Date,
      required: true
    },
    shift: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  data: () => ({
    menu: false
  }),
  computed: {
    time: {
      get() {
        return format(this.value, "HH:mm");
      },
      set(val) {
        const [year, month, day] = format(this.value, "YYYY-MM-DD").split("-");
        const [hours, minutes] = val.split(":");
        const date = new Date(year, month - 1, day, hours, minutes);
        this.$emit("input", date);
      }
    },
    min() {
      if (this.type === "start") return undefined;

      return format(this.shift.date.start, "HH:mm");
    },
    max() {
      if (this.type === "end") return undefined;

      return format(this.shift.date.end, "HH:mm");
    }
  }
};
</script>
