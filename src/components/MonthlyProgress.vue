<template>
  <v-card>
    <v-card-title>Monthly progress</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="2">
          <v-progress-circular
            color="primary"
            size="64"
            width="6"
            rotate="270"
            :value="progress"
          >
            {{ printProgress }}%
          </v-progress-circular>
        </v-col>
        <v-col cols="10">
          <span class="d-block">{{ debit | formattedTime }} per month</span>
          <span class="d-block">{{ credit | formattedTime }} worked</span>
          <span class="d-block body-2 font-weight-black">
            {{ printRemaining }}
          </span>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "MonthlyProgress",
  filters: {
    formattedTime(time) {
      const [hours, minutes] = time.split(":");

      return `${hours}h${minutes}m`;
    }
  },
  props: {
    credit: {
      type: String,
      required: true
    },
    debit: {
      type: String,
      required: true
    }
  },
  computed: {
    printProgress() {
      if (this.progress > 100) {
        return `>100`;
      }

      return this.progress.toFixed(0);
    },
    progress() {
      return (100 * this.totalMinutesWorked) / this.totalMinutesPerMonth;
    },
    totalMinutesPerMonth() {
      const [debitHours, debitMinutes] = this.debit.split(":");

      return parseInt(debitHours) * 60 + parseInt(debitMinutes);
    },
    totalMinutesWorked() {
      const [creditHours, creditMinutes] = this.credit.split(":");

      return parseInt(creditHours) * 60 + parseInt(creditMinutes);
    },
    totalMinutesLeft() {
      return this.totalMinutesPerMonth - this.totalMinutesWorked;
    },
    remainingTime() {
      let hoursLeft = String(Math.floor(this.totalMinutesLeft / 60));
      let minutesLeft = String(this.totalMinutesLeft % 60);

      if (hoursLeft.length < 2) {
        hoursLeft = "0" + hoursLeft;
      }

      if (minutesLeft.length < 2) {
        minutesLeft = "0" + minutesLeft;
      }

      return `${hoursLeft}:${minutesLeft}`;
    },
    printRemaining() {
      let remainingTime = this.remainingTime;

      if (this.totalMinutesLeft < 0) {
        remainingTime = "00:00";
      }

      return `${remainingTime} remaining`;
    }
  }
};
</script>
