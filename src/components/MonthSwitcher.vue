<template>
  <v-row justify="center">
    <v-btn :disabled="!hasPrevMonth" text @click="gotoPrevMonth">
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
        :value="dateString"
        :allowed-dates="allowedMonths"
        :min="minMonth"
        :max="maxMonth"
        type="month"
        @input="inputDate"
      ></v-date-picker>
    </v-menu>

    <v-btn :disabled="!hasNextMonth" text @click="gotoNextMonth">
      <v-icon>{{ icons.mdiChevronRight }}</v-icon>
    </v-btn>
  </v-row>
</template>

<script>
import { mdiChevronLeft, mdiChevronRight } from "@mdi/js";
import { addMonths, isSameMonth, subMonths } from "date-fns";
import { localizedFormat } from "@/utils/date";
import { mapGetters } from "vuex";

export default {
  name: "MonthSwitcher",
  props: {
    date: {
      type: Date,
      required: true
    }
  },
  data: () => ({
    menu: false,
    icons: { mdiChevronLeft, mdiChevronRight }
  }),
  computed: {
    ...mapGetters({
      selectedContract: "selectedContract/selectedContract",
      selectedReports: "contentData/selectedReports"
    }),
    dateString() {
      return localizedFormat(this.date, "yyyy-MM");
    },
    formattedDate() {
      return localizedFormat(this.date, "MMMM yyyy");
    },
    months() {
      return this.selectedReports.map((item) => item.monthYear);
    },
    hasNextMonth() {
      return !isSameMonth(this.selectedContract.endDate, this.date);
    },
    hasPrevMonth() {
      return !isSameMonth(this.selectedContract.startDate, this.date);
    },
    minMonth() {
      return localizedFormat(this.selectedContract.startDate, "yyyy-MM");
    },
    maxMonth() {
      return localizedFormat(this.selectedContract.endDate, "yyyy-MM");
    }
  },
  methods: {
    setDate(value) {
      this.$emit("update", value);
    },
    gotoPrevMonth() {
      if (!this.hasPrevMonth) return;
      const date = subMonths(this.date, 1);
      this.setDate(date);
    },
    gotoNextMonth() {
      if (!this.hasNextMonth) return;
      const date = addMonths(this.date, 1);
      this.setDate(date);
    },
    allowedMonths(value) {
      return parseInt(value.split("-")[1], 10);
    },
    inputDate(value) {
      this.setDate(new Date(value));
    }
  }
};
</script>
