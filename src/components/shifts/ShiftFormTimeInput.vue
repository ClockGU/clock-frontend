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
        :error-messages="errors"
        readonly
        prepend-inner-icon="access_time"
        @blur="$emit('update')"
        @change="$emit('update')"
        v-on="on"
      ></v-text-field>
    </template>
    <v-time-picker
      v-if="menu"
      v-model="time"
      no-title
      format="24hr"
      @click:minute="$refs.menu.save(time)"
    ></v-time-picker>
  </v-menu>
</template>

<script>
import { format } from "date-fns";
import { Shift } from "@/models/ShiftModel";

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
    }
  },
  data: () => ({
    menu: false,
    opposites: {
      start: "end",
      end: "start"
    }
  }),
  computed: {
    time: {
      get() {
        return format(this.value.date[this.type], "HH:mm");
      },
      set(val) {
        const [year, month, day] = format(
          this.value.date[this.type],
          "YYYY-MM-DD"
        ).split("-");
        const [hours, minutes] = val.split(":");
        const date = new Date(year, month - 1, day, hours, minutes);

        const newValue = { ...this.value };
        newValue.date[this.type] = date;
        const shift = new Shift({ ...newValue });

        this.$emit("input", shift);
      }
    }
  }
};
</script>
