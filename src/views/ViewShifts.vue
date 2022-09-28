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
                      <v-btn
                        :disabled="disabled"
                        color="primary"
                        @click="newShift"
                      >
                        {{
                          $t("buttons.newEntity", {
                            entity: $tc("models.shift")
                          })
                        }}
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-toolbar>

                <MonthSwitcher
                  :disabled="disabled"
                  :date="date"
                  @update="updateDate"
                />

                <ShiftsTable
                  :shifts="pastShifts"
                  :loading="loading"
                  :search="pastSearch"
                  past-shifts
                  @edit="editShift"
                >
                  <template #head="{ destroyFn, selected }">
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
                            dense
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
                      :destroy-fn="destroyFn"
                      :shifts="selected"
                      can-review
                      :more-than-one-contract="moreThanOneContract"
                      @edit="editShift"
                    />
                  </template>
                </ShiftsTable>

                <ShiftsTable
                  :shifts="futureShifts"
                  :loading="loading"
                  :search="futureSearch"
                  @edit="editShift"
                >
                  <template #head="{ destroyFn, selected }">
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
                            dense
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
                      :destroy-fn="destroyFn"
                      @edit="editShift"
                    />
                  </template>
                </ShiftsTable>
                <v-fade-transition>
                  <v-overlay
                    v-if="disabled && (hover || touchOverlay)"
                    absolute
                    color="primary"
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

    <FormDialog
      v-if="showFormDialog"
      entity-name="shift"
      :entity="shiftEntity"
      @close="closeFormDialog"
    />
  </v-container>
</template>

<script>
import FormDialog from "@/components/FormDialog";
import MonthSwitcher from "@/components/MonthSwitcher";
import SelectContractFilter from "@/components/SelectContractFilter";
import ShiftBulkActions from "@/components/shifts/ShiftBulkActions";
import ShiftsTable from "@/components/shifts/ShiftsTable";

import { mapGetters } from "vuex";

import { mdiMagnify } from "@mdi/js";
import { isFuture, isPast, isSameMonth } from "date-fns";
import { firstOfMonth } from "@/utils/date";

export default {
  name: "Shifts",
  components: {
    FormDialog,
    MonthSwitcher,
    SelectContractFilter,
    ShiftBulkActions,
    ShiftsTable
  },
  data: () => ({
    icons: { mdiMagnify },
    date: firstOfMonth,
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
      return this.shifts.filter((shift) => isPast(shift.started));
    },
    futureShifts() {
      return this.shifts.filter((shift) => isFuture(shift.started));
    },
    moreThanOneContract() {
      return this.contracts.length > 1;
    },
    disabled() {
      return this.selectedContract === undefined;
    }
  },
  methods: {
    toggleTouchOverlay(hover) {
      this.touchOverlay = hover ? false : !this.touchOverlay;
    },
    editShift(shift) {
      this.shiftEntity = shift;
      this.showFormDialog = true;
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
