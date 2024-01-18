<template>
  <v-card outlined>
    <v-hover>
      <template #default="{ hover }">
        <div @click="toggleTouchOverlay(hover)">
          <v-card-title>
            <span>
              {{ $t("reports.vacation") }}
            </span>
            <v-spacer></v-spacer>
          </v-card-title>

          <v-card-text>
            <v-simple-table>
              <template #default>
                <tbody>
                  <tr v-for="row in rows" :key="row.name">
                    <td>{{ row.name }}</td>
                    <td class="text-right">{{ row.value }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card-text>
        </div>
      </template>
    </v-hover>
  </v-card>
</template>

<script>
import { localizedFormat } from "@/utils/date";
import { parseISO } from "date-fns";

export default {
  name: "VacationCard",
  filters: {
    formatDate(date) {
      return localizedFormat(parseISO(date), "MMMM yyyy");
    }
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    report: {
      type: Object,
      required: false,
      default: undefined
    }
  },
  data() {
    return {
      pdf: null,
      loading: false,
      lockLoading: false,
      touchOverlay: false
    };
  },
  computed: {
    rows() {
      return [
        {
          name: this.$t("reports.vacationCarryoverPrev"),
          value: this.report.vacationCarryoverPreviousMonth
        },
        {
          name: this.$t("reports.debitVacationTime"),
          value: this.report.debitVacationTime
        },
        {
          name: this.$t("reports.vacationTime"),
          value: this.report.vacationTime
        },
        {
          name: this.$t("reports.vacationCarryoverNext"),
          value: this.report.vacationCarryoverNextMonth
        }
      ];
    }
  },
  methods: {
    toggleTouchOverlay(hover) {
      this.touchOverlay = hover ? false : !this.touchOverlay;
    }
  }
};
</script>

<style lang="scss" scoped>
.warn {
  color: #ff5252;
}
</style>
