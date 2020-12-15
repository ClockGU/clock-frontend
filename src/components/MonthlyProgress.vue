<template>
  <v-card>
    <v-card-title>
      {{ $t("dashboard.progress.title") }}
    </v-card-title>
    <v-card-text>
      <v-row align="center" justify="space-between">
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
        <v-col cols="9">
          <v-simple-table>
            <template #default>
              <tbody>
                <tr v-for="row in azkData" :key="row.name">
                  <td>{{ row.name }}</td>
                  <td>{{ row.value }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { formattedTime } from "@/utils/time";

export default {
  name: "MonthlyProgress",
  props: {
    azkData: {
      type: Array,
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
      const [debitHours, debitMinutes] = this.azkData[1].value.split(":");

      return parseInt(debitHours) * 60 + parseInt(debitMinutes);
    },
    totalMinutesWorked() {
      const [creditHours, creditMinutes] = this.azkData[2].value.split(":");

      return parseInt(creditHours) * 60 + parseInt(creditMinutes);
    }
  },
  methods: {
    formattedTime(value) {
      return formattedTime(value);
    }
  }
};
</script>
