<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <SelectContractFilter
          :disabled="disabled"
          :contracts="contracts"
          :selected-contract="selectedContract"
        />
      </v-col>
      <v-col>
        <v-card>
          <v-hover>
            <template #default="{ hover }">
              <div @click="toggleTouchOverlay(hover)">
                <v-toolbar flat>
                  <v-row>
                    <v-col>
                      <ShiftFormDialog
                        :initial-date="initialDate"
                        btn-color="primary"
                      ></ShiftFormDialog>
                    </v-col>
                  </v-row>
                </v-toolbar>

                <MonthSwitcher
                  v-model="date"
                  :disabled="disabled"
                />

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
                          <span>{{ $t("shifts.table.pastShiftsTitle") }}</span>
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
                            density="compact"
                            hide-details
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-card-title>

                    <v-card-text>
                      {{ $t("shifts.table.pastShiftsHint") }}
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

                <ShiftsTable
                  :shifts="futureShifts"
                  :loading="loading"
                  :search="futureSearch"
                >
                  <template #head="{ selected, reset }">
                    <v-card-title>
                      <v-row>
                        <v-col cols="12" md="5">
                          <span>{{
                            $t("shifts.table.futureShiftsTitle")
                          }}</span>
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
                <v-fade-transition>
                  <v-overlay
                    v-if="disabled && (hover || touchOverlay)"
                    absolute
                    scrim="primary"
                    style="align-items: start"
                  >
                    <p style="margin-top: 17%" class="text-center">
                      {{ $t("dashboard.disabled.shiftsHere") }}
                    </p>
                  </v-overlay>
                </v-fade-transition>
              </div>
            </template>
          </v-hover>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import MonthSwitcher from "@/components/MonthSwitcher.vue";
import SelectContractFilter from "@/components/SelectContractFilter.vue";
import ShiftBulkActions from "@/components/shifts/ShiftBulkActions.vue";
import ShiftsTable from "@/components/shifts/ShiftsTable.vue";
import ShiftFormDialog from "@/components/forms/dialogs/ShiftFormDialog.vue";

import { mapGetters } from "vuex";

import { mdiMagnify } from "@mdi/js";
import { isFuture, isPast, isSameMonth } from "date-fns";
import { firstOfCurrentMonth } from "@/utils/date";

export default {
  name: "Shifts",
  components: {
    ShiftFormDialog,
    MonthSwitcher,
    SelectContractFilter,
    ShiftBulkActions,
    ShiftsTable
  },
  data: () => ({
    icons: { mdiMagnify },
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
