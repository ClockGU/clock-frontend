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
      <SelectContractFilter
        :contracts="contracts"
        :selected-contract="selectedContract"
      />
      <v-row :justify="loading && !ignoreLoading ? 'center' : 'start'">
        <v-col v-if="loading && !ignoreLoading" cols="10" md="6" class="pt-0">
          <v-skeleton-loader
            v-if="loading"
            data-cy="skeleton"
            type="card"
            width="90%"
            :loading="true"
          ></v-skeleton-loader>
        </v-col>

        <v-col v-else>
          <v-row>
            <ReportCard
              v-for="report in sortedReports"
              :key="report.uuid"
              :report="report"
              :exported="report.exported"
            ></ReportCard>
          </v-row>
        </v-col>
      </v-row>
    </template>
  </base-layout>
</template>

<script>
import ReportCard from "@/components/ReportCard";
import SelectContractFilter from "@/components/SelectContractFilter";

import { datesGroupByComponent } from "@/utils/shift";

import { mapGetters } from "vuex";

export default {
  name: "ViewReportList",
  metaInfo() {
    return {
      title: this.$t("app.reports")
    };
  },
  components: {
    ReportCard,
    SelectContractFilter
  },
  data() {
    return {
      dialog: false,
      callback: null,
      hover: false,
      ignoreLoading: false
    };
  },
  beforeRouteLeave(to, from, next) {
    this.ignoreLoading = true;

    next();
  },
  computed: {
    ...mapGetters({
      loading: "report/loading",
      reports: "report/reports",
      shifts: "shift/shifts",
      contracts: "contract/contracts"
    }),
    selectedContract() {
      const uuid = this.$route.params.contract;

      return this.contracts.find(contract => contract.uuid === uuid) || {};
    },
    shiftsOfContract() {
      return this.shifts.filter(
        shift => shift.contract === this.selectedContract.uuid
      );
    },
    extendedReports() {
      return this.reportsInContract.map(report => ({
        ...report,
        exported: this.checkExported(report.date)
      }));
    },
    reportsInContract() {
      return this.reports.filter(
        report => report.contract === this.selectedContract.uuid
      );
    },
    sortedReports() {
      const reports = this.extendedReports;
      return reports.sort((a, b) => a.date < b.date);
    },
    shiftsByMonth() {
      return datesGroupByComponent(this.shiftsOfContract, "y MM");
    }
  },
  async created() {
    await this.$store.dispatch("contract/queryContracts");
    await this.$store.dispatch("shift/queryShifts");
    await this.$store.dispatch("report/list");
  },
  methods: {
    checkExported(date) {
      const [year, month] = date.slice(0, 7).split("-");
      const key = `${year} ${month}`;
      if (!(key in this.shiftsByMonth)) return false;

      const shifts = this.shiftsByMonth[key];
      const exported = shifts.map(shift => shift.exported);
      return exported.every(x => x);
    }
  }
};
</script>
