<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-alert v-if="personnelNumberMissing" type="warning">
          {{ $t("reports.personnelNumberMissing") }}
        </v-alert>
      </v-col>
      <v-col cols="12">
        <SelectContractFilter
          :contracts="contracts"
          :selected-contract="selectedContract"
        />
      </v-col>

      <v-col>
        <DataFilter
          :date="date"
          :contract="selectedContract"
          @update="updateDate"
        >
          <template #default="{ data }">
            <v-row justify="center">
              <v-btn
                :disabled="!data.hasPrevMonth()"
                text
                @click="data.prevMonth"
              >
                <v-icon>{{ icons.mdiChevronLeft }}</v-icon>
              </v-btn>

              <v-menu
                v-model="dateMenu"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn text v-bind="attrs" v-on="on">
                    {{ date }}
                  </v-btn>
                </template>
                <v-date-picker
                  :value="date"
                  :allowed-dates="data.months.allowedMonths"
                  :min="data.months.min"
                  :max="data.months.max"
                  type="month"
                  @input="updateDate($event)"
                ></v-date-picker>
              </v-menu>

              <v-btn
                :disabled="!data.hasNextMonth()"
                text
                @click="data.nextMonth"
              >
                <v-icon>{{ icons.mdiChevronRight }}</v-icon>
              </v-btn>
            </v-row>

            <DashboardConflicts :shifts="data.shifts" :month="data.date" />

            <ReportCard
              :key="data.report.uuid"
              :report="data.report"
              :exported="data.isCurrentMonthLocked"
              :is-lockable="!data.isCurrentMonthLocked"
              :is-first-unlocked-month="data.firstUnlockedMonth === date"
              :shifts="data.shifts"
              :carryover="data.carryover()"
              @locked="refresh"
            ></ReportCard>
          </template>
        </DataFilter>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mdiChevronLeft, mdiChevronRight } from "@mdi/js";

import DataFilter from "@/components/DataFilter";
import DashboardConflicts from "@/components/DashboardConflicts";
import SelectContractFilter from "@/components/SelectContractFilter";
import ReportCard from "@/components/ReportCard";
import { mapGetters } from "vuex";

export default {
  name: "Reporting",
  components: {
    DataFilter,
    DashboardConflicts,
    ReportCard,
    SelectContractFilter
  },
  data: () => ({
    dateMenu: false,
    date: "2020-07",
    icons: { mdiChevronLeft, mdiChevronRight }
  }),
  computed: {
    ...mapGetters({
      contracts: "contract/contracts"
    }),
    selectedContract() {
      const uuid = this.$route.params.contract;

      return this.contracts.find(contract => contract.uuid === uuid);
    },
    personnelNumberMissing() {
      return (
        !this.$store.state.user.personal_number &&
        this.$store.state.user.personal_number !== undefined
      );
    }
  },
  methods: {
    updateDate(value) {
      this.date = value;
    },
    async refresh() {
      await Promise.all([
        this.$store.dispatch("shift/queryShifts"),
        this.$store.dispatch("contract/queryContracts"),
        this.$store.dispatch("report/list")
      ]);
    }
  }
};
</script>
