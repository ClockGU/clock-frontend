<template>
    <v-hover v-slot="{isHovering, props}">
      <v-card :ripple="false" v-bind="props" v-on="disabled ? { click: () => toggleTouchOverlay(isHovering) } : {}">
          <v-card-title>
            <span>
              {{ $t("reports.vacation") }}
            </span>
            <v-spacer></v-spacer>
          </v-card-title>

          <v-card-text>
            <v-table>
              <template #default>
                <tbody>
                  <tr v-for="row in rows" :key="row.name">
                    <td>{{ row.name }}</td>
                    <td class="text-right">{{ row.value }}</td>
                  </tr>
                </tbody>
              </template>
            </v-table>
          </v-card-text>
          <v-overlay
            :model-value="disabled && (isHovering || touchOverlay)"
            contained
            persistent
            :close-on-content-click="false"
            scrim="primary"
            style="align-items: start; justify-content: center"
          >
            <p style="margin-top: 17%; color: white; text-align: center">
              {{ $t("dashboard.disabled.reportHere") }}
            </p>
          </v-overlay>
      </v-card>
    </v-hover>
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
