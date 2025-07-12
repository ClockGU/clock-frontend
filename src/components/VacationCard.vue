<template>
  <v-hover v-slot="{ isHovering, props }">
    <v-card
      :ripple="false"
      v-bind="props"
      v-on="disabled ? { click: () => toggleTouchOverlay(isHovering) } : {}"
      tabindex="0"
      role="region"
      :aria-labelledby="`vacation-card-title`"
    >
      <v-card-title>
        <h2 id="vacation-card-title" class="text-h6">
          {{ $t("aria.report.vacationTitle") }}
        </h2>
        <v-spacer></v-spacer>
      </v-card-title>

      <v-card-text>
        <div aria-live="polite" aria-atomic="true" class="sr-only">
          {{ $t("aria.report.vacationSummary") }}:
          {{ rows.map(r => `${r.name}: ${r.value}`).join(', ') }}
        </div>

        <v-table>
          <template #default>
            <thead>
              <tr>
                <th scope="col">{{ $t("aria.table.label") }}</th>
                <th scope="col" class="text-right">{{ $t("aria.table.value") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in rows"
                :key="row.name"
                tabindex="0"
                role="row"
                :aria-label="`${row.name}, ${row.value}`"
              >
                <td role="cell">{{ row.name }}</td>
                <td role="cell" class="text-right">{{ row.value }}</td>
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
.sr-only {
  position: absolute !important;
  height: 1px;
  width: 1px;
  overflow: hidden;
  clip: rect(1px, 1px, 1px, 1px);
  white-space: nowrap;
}
</style>
