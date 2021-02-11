<template>
  <v-row justify="center">
    <v-btn :disabled="!data.hasPrevMonth()" text @click="data.prevMonth">
      <v-icon>{{ icons.mdiChevronLeft }}</v-icon>
    </v-btn>

    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :nudge-right="40"
      transition="scale-transition"
      offset-y
      min-width="290px"
    >
      <template #activator="{ on, attrs }">
        <v-btn text v-bind="attrs" v-on="on">
          {{ formattedDate }}
        </v-btn>
      </template>
      <v-date-picker
        :value="date"
        :allowed-dates="data.months.allowedMonths"
        :min="data.months.min"
        :max="data.months.max"
        type="month"
        @input="$emit('update', $event)"
      ></v-date-picker>
    </v-menu>

    <v-btn :disabled="!data.hasNextMonth()" text @click="data.nextMonth">
      <v-icon>{{ icons.mdiChevronRight }}</v-icon>
    </v-btn>
  </v-row>
</template>

<script>
import { mdiChevronLeft, mdiChevronRight } from "@mdi/js";
import { parseISO } from "date-fns";
import { localizedFormat } from "@/utils/date";

export default {
  name: "MonthSwitcher",
  props: {
    date: {
      type: String,
      required: true
    },
    data: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    menu: false,
    icons: { mdiChevronLeft, mdiChevronRight }
  }),
  computed: {
    formattedDate() {
      return localizedFormat(parseISO(this.date), "MMMM yyyy");
    }
  }
};
</script>
