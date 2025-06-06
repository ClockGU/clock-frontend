<template>
    <v-container role="main" aria-labelledby="page-title">
     <!-- Screen-reader-only page title -->
    <h1 id="page-title" class="sr-only">{{ $t('sr.viewShifts.h1') }}</h1>
    <v-row>
      <v-col cols="12">
        <SelectContractFilter
          :disabled="disabled"
          :contracts="contracts"
          :selected-contract="selectedContract"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-hover v-slot="{ isHovering, props }">
          <v-card
            :ripple="false"
            v-bind="props"
            role="region"
            aria-labelledby="shifts-heading"
            v-on="
              disabled ? { click: () => toggleTouchOverlay(isHovering) } : {}
            "
          >
            <v-card-title>
              <h2 class="sr-only">
                {{ $t('sr.viewShifts.h2') }}
              </h2>
              <v-row>
                <v-col>
                  <ShiftFormDialog
                    :initial-date="initialDate"
                    btn-color="primary"
                  ></ShiftFormDialog>
                </v-col>
              </v-row>
            </v-card-title>
            <v-row>
              <v-col class="text-center" cols="12">
                <TimeIntervalSwitcher v-model="date" :disabled="disabled" />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <ShiftsTable
                  :shifts="pastShifts"
                  :loading="loading"
                  :search="pastSearch"
                  past-shifts
                >
                  <template #head="{ selected, reset }">
                    <v-card-title>
                      <v-row>
                        <v-col cols="12" md="5">
                          <h3>{{
                            $tc("shifts.table.pastShiftsTitle", [
                              formattedDate()
                            ])
                          }}</h3>
                        </v-col>

                        <v-spacer></v-spacer>

                        <v-col
                          cols="12"
                          sm="5"
                          :offset-sm="selected.length > 0 ? 0 : 7"
                          offset-md="0"
                          md="3"
                        >
                          <v-text-field
                            v-model="pastSearch"
                            :append-icon="icons.mdiMagnify"
                            :label="$t('actions.search')"
                            :aria-label="$t('aria.viewShifts.searchPast')"
                            role="search"
                            density="compact"
                            hide-details
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-card-title>

                    <v-card-text>
                      {{ $t("shifts.table.pastShiftsHint") }}
                      (<v-icon color="success" aria-hidden="true">{{ icons.mdiCheck }}</v-icon
                      >/<v-icon color="error" aria-hidden="true">{{ icons.mdiClose }}</v-icon
                      >).
                    </v-card-text>
                    <ShiftBulkActions
                      v-if="selected.length > 0"
                      :shifts="selected"
                      can-review
                      :more-than-one-contract="moreThanOneContract"
                      :reset-fn="reset"
                    />
                  </template>
                </ShiftsTable>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <ShiftsTable
                  :shifts="futureShifts"
                  :loading="loading"
                  :search="futureSearch"
                >
                  <template #head="{ selected, reset }">
                    <v-card-title>
                      <v-row>
                        <v-col cols="12" md="5">
                          <h3>{{
                            $tc("shifts.table.futureShiftsTitle", [
                              formattedDate()
                            ])
                          }}</h3>
                        </v-col>

                        <v-spacer></v-spacer>
                        <v-col
                          cols="12"
                          sm="5"
                          :offset-sm="selected.length > 0 ? 0 : 7"
                          offset-md="0"
                          md="3"
                        >
                          <v-text-field
                            v-model="futureSearch"
                            :append-icon="icons.mdiMagnify"
                            :label="$t('actions.search')"
                            :aria-label="$t('aria.viewShifts.searchFuture')"
                            role="search"
                            density="compact"
                            hide-details
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-card-title>

                    <v-card-text>
                      {{ $t("shifts.table.futureShiftsHint") }}
                    </v-card-text>
                    <ShiftBulkActions
                      v-if="selected.length > 0"
                      :more-than-one-contract="moreThanOneContract"
                      :shifts="selected"
                      :reset-fn="reset"
                    />
                  </template>
                </ShiftsTable>
              </v-col>
            </v-row>
            <v-overlay
              :model-value="disabled && (isHovering || touchOverlay)"
              contained
              persistent
              :close-on-content-click="false"
              scrim="primary"
              style="align-items: start; justify-content: center"  
            >
              <p style="margin-top: 15%; color: white; text-align: center">
                {{ $t("dashboard.disabled.shiftsHere") }}
              </p>
            </v-overlay>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import SelectContractFilter from "@/components/SelectContractFilter.vue";
import ShiftBulkActions from "@/components/shifts/ShiftBulkActions.vue";
import ShiftsTable from "@/components/shifts/ShiftsTable.vue";
import ShiftFormDialog from "@/components/forms/dialogs/ShiftFormDialog.vue";

import { mapGetters } from "vuex";

import { mdiMagnify, mdiCheck, mdiClose } from "@mdi/js";
import { isFuture, isPast, isSameMonth } from "date-fns";

import { firstOfCurrentMonth, localizedFormat } from "@/utils/date";
import TimeIntervalSwitcher from "@/components/TimeIntervalSwitcher.vue";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Shifts",
  components: {
    TimeIntervalSwitcher,
    ShiftFormDialog,
    SelectContractFilter,
    ShiftBulkActions,
    ShiftsTable
  },
  data: () => ({
    icons: { mdiMagnify, mdiCheck, mdiClose },
    date: firstOfCurrentMonth,
    loading: false,
    shiftEntity: null,
    showFormDialog: false,
    pastSearch: "",
    futureSearch: "",
    touchOverlay: false
  }),
  computed: {
    ...mapGetters({
      contracts: "contentData/allContracts",
      selectedContract: "selectedContract/selectedContract",
      selectedShifts: "contentData/selectedShifts"
    }),
    shifts() {
      if (this.disabled) return [];
      return this.selectedShifts.filter((shift) =>
        isSameMonth(shift.started, this.date)
      );
    },
    pastShifts() {
      return this.shifts.filter((shift) => isPast(shift.stopped));
    },
    futureShifts() {
      return this.shifts.filter((shift) => isFuture(shift.started));
    },
    moreThanOneContract() {
      return this.contracts.length > 1;
    },
    disabled() {
      return this.selectedContract === undefined;
    },
    initialDate() {
      if (isSameMonth(this.date, new Date())) return new Date();
      return this.date;
    }
  },
  methods: {
    formattedDate() {
      return localizedFormat(this.date, "MMMM yyyy");
    },
    toggleTouchOverlay(hover) {
      this.touchOverlay = hover ? false : !this.touchOverlay;
    },
    newShift() {
      this.showFormDialog = true;
    },
    closeFormDialog() {
      this.showFormDialog = false;
      this.shiftEntity = null;
    },
    updateDate(value) {
      this.date = value;
    }
  }
};
</script>
