<template>
  <v-row class="my-4" justify="center">
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
import { addMonths, isAfter, isBefore, subMonths } from "date-fns";
import { firstOfCurrentMonth, localizedFormat } from "@/utils/date";
import { mapGetters } from "vuex";

export default {
  name: "MonthSwitcher",
  props: {
    date: {
      type: Date,
      required: true
    },
    allowedDateFn: {
      type: Function,
      required: false,
      default: undefined
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
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
      if (this.disabled) return false;
      const nextMonth = addMonths(this.date, 1);
      return (
        !isAfter(nextMonth, this.selectedContract.endDate) &&
        this.allowedMonths(localizedFormat(nextMonth, "yyyy-MM"))
      );
    },
    hasPrevMonth() {
      if (this.disabled) return false;
      const prevMonth = subMonths(this.date, 1);
      return (
        !isBefore(prevMonth, this.selectedContract.startDate) &&
        this.allowedMonths(localizedFormat(prevMonth, "yyyy-MM"))
      );
    },
    minMonth() {
      if (this.disabled) return localizedFormat(firstOfCurrentMonth, "yyyy-MM");
      return localizedFormat(this.selectedContract.startDate, "yyyy-MM");
    },
    maxMonth() {
      if (this.disabled) return localizedFormat(firstOfCurrentMonth, "yyyy-MM");
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
      if (this.allowedDateFn !== undefined) return this.allowedDateFn(value);
      return parseInt(value.split("-")[1], 10);
    },
    inputDate(value) {
      this.setDate(new Date(value));
    }
  }
};
</script>
