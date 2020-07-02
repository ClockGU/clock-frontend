<template>
  <base-layout
    alternative-portal-target="card-toolbar"
    :card-elevation="$vuetify.breakpoint.smAndDown ? 0 : null"
  >
    <template v-slot:card-top>
      <portal-target name="card-toolbar"></portal-target>
    </template>

    <template v-slot:pre-toolbar-title="{ action }">
      <v-app-bar-nav-icon
        v-if="$vuetify.breakpoint.smAndDown"
        icon
        @click="action"
      ></v-app-bar-nav-icon>
    </template>

    <template v-slot:title>
      {{ $tc("models.report", 2) }}
    </template>

    <template v-slot:content>
      <DataFilter>
        <template #default="{ data }">
          <v-stepper v-model="step" vertical>
            <v-stepper-step :complete="step > 1" step="1">
              Select a month
            </v-stepper-step>

            <v-stepper-content step="1">
              <v-date-picker
                v-model="date"
                :allowed-dates="data.allowedMonths"
                :min="data.months.min"
                :max="data.months.max"
                :landscape="true"
                type="month"
              ></v-date-picker>

              <v-divider></v-divider>
              <v-btn color="primary" @click="step = 2">Continue</v-btn>
              <v-btn text>Cancel</v-btn>
            </v-stepper-content>

            <v-stepper-step :complete="step > 2" step="2">
              Problem check
              <small>Making sure everything is in order.</small>
            </v-stepper-step>

            <v-stepper-content step="2">
              <DashboardConflicts :shifts="data.shifts" />

              <v-divider></v-divider>
              <v-btn color="primary" @click="step = 3">Continue</v-btn>
              <v-btn text>Cancel</v-btn>
            </v-stepper-content>

            <v-stepper-step :complete="step > 3" step="3">
              Export the Stundenzettel
            </v-stepper-step>

            <v-stepper-content step="3">
              <ReportCard
                :key="data.reports[0].uuid"
                :report="data.reports[0]"
                :exported="data.reports[0].exported"
              ></ReportCard>

              <v-divider></v-divider>
              <v-btn color="primary" @click="step = 4">Continue</v-btn>
              <v-btn text>Cancel</v-btn>
            </v-stepper-content>

            <v-stepper-step step="4">Finalize the report</v-stepper-step>
            <v-stepper-content step="4">
              <span>
                Before exporting the next month, you need to finalize the
                report. Warning: after finalizing the report, you will not be
                able to edit any shifts of that month!
              </span>

              <v-btn @click="finalize">
                Finalize
              </v-btn>

              <v-divider></v-divider>
              <v-btn color="primary" @click="step = 1">Continue</v-btn>
              <v-btn text>Cancel</v-btn>
            </v-stepper-content>
          </v-stepper>
          {{ json(data) }}
        </template>
      </DataFilter>
    </template>
  </base-layout>
</template>

<script>
import DataFilter from "@/components/DataFilter";
import DashboardConflicts from "@/components/DashboardConflicts";
import ReportCard from "@/components/ReportCard";
export default {
  name: "Reporting",
  components: { DataFilter, DashboardConflicts, ReportCard },
  data: () => ({
    allowedDates: ["2020-06", "2020-07"],
    date: "2020-07",
    step: 1
  }),
  methods: {
    json(data) {
      console.log(JSON.stringify(data, null, 2));
    },
    finalize() {
      alert("Das ist jetzt aber nicht final.");
    }
  }
};
</script>
