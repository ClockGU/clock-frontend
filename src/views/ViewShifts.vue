<template>
  <v-container>
    <v-row>
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
          :shift-fn="processShifts"
          @update="updateDate"
        >
          <template #default="{ data }">
            <v-card>
              <v-toolbar flat>
                <v-row>
                  <v-col>
                    <v-btn color="primary" @click="newShift">
                      {{
                        $t("buttons.newEntity", { entity: $tc("models.shift") })
                      }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-toolbar>

              <MonthSwitcher :data="data" :date="date" @update="updateDate" />

              <ShiftsTable
                :shifts="data.pastShifts"
                :loading="loading"
                :search="pastSearch"
                past-shifts
                @edit="editShift"
                @refresh="refresh"
              >
                <template #head="{ destroyFn, selected }">
                  <v-card-title>
                    <v-row>
                      <v-col cols="12" md="5">
                        <span>
                          {{ $t("shifts.table.pastShiftsTitle") }}
                          {{ durationSum(data.pastShifts) }}
                        </span>
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
                    :contracts="contracts"
                    can-review
                    @edit="editShift"
                    @refresh="refresh"
                  />
                </template>
              </ShiftsTable>

              <ShiftsTable
                :shifts="data.futureShifts"
                :loading="loading"
                :search="futureSearch"
                @edit="editShift"
                @refresh="refresh"
              >
                <template #head="{ destroyFn, selected }">
                  <v-card-title>
                    <v-row>
                      <v-col cols="12" md="5">
                        <span>
                          {{ $t("shifts.table.futureShiftsTitle") }}
                          {{ durationSum(data.futureShifts) }}
                        </span>
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
                    :shifts="selected"
                    :contracts="contracts"
                    :destroy-fn="destroyFn"
                    @edit="editShift"
                    @refresh="refresh"
                  />
                </template>
              </ShiftsTable>
            </v-card>
          </template>
        </DataFilter>
      </v-col>
    </v-row>

    <FormDialog
      v-if="showFormDialog"
      entity-name="shift"
      :entity="shiftEntity"
      @close="closeFormDialog"
      @refresh="refresh"
    />
  </v-container>
</template>

<script>
import { localizedFormat } from "@/utils/date";
import DataFilter from "@/components/DataFilter";
import FormDialog from "@/components/FormDialog";
import MonthSwitcher from "@/components/MonthSwitcher";
import SelectContractFilter from "@/components/SelectContractFilter";
import ShiftBulkActions from "@/components/shifts/ShiftBulkActions";
import ShiftsTable from "@/components/shifts/ShiftsTable";
import { minutesToHHMM } from "@/utils/time";

import { mapGetters } from "vuex";
import { Shift } from "@/models/ShiftModel";

import { mdiMagnify } from "@mdi/js";

export default {
  name: "Shifts",
  components: {
    DataFilter,
    FormDialog,
    MonthSwitcher,
    SelectContractFilter,
    ShiftBulkActions,
    ShiftsTable
  },
  data: () => ({
    icons: { mdiMagnify },
    date: localizedFormat(new Date(), "yyyy-MM"),
    loading: false,
    shiftEntity: null,
    showFormDialog: false,
    pastSearch: "",
    futureSearch: ""
  }),
  computed: {
    ...mapGetters({
      contracts: "contract/contracts"
    }),
    selectedContract() {
      const uuid = this.$route.params.contract;

      return this.contracts.find((contract) => contract.uuid === uuid);
    }
  },
  methods: {
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

      //really? If nothing has changed - why refresh?
      this.refresh();
    },
    processShifts(shift) {
      const shiftModel = new Shift(shift);

      return {
        date: shiftModel.date.start,
        start: shiftModel.date.start,
        end: shiftModel.date.end,
        duration: shiftModel.duration,
        type: this.$t(`shifts.types.${shiftModel.type.value}`),
        reviewed: shiftModel.reviewed,
        uuid: shiftModel.uuid,
        shift: shiftModel,
        contract: shiftModel.contract,
        tags: shiftModel.tags,
        note: shiftModel.note
      };
    },
    updateDate(value) {
      this.date = value;
    },
    async refresh() {
      this.loading = true;
      const selectedMonth = this.date;
      await Promise.all([
        this.$store.dispatch("shift/queryShifts"),
        this.$store.dispatch("contract/queryContracts"),
        this.$store.dispatch("report/list")
      ]);
      this.updateDate(selectedMonth);
      this.loading = false;
    },
    durationSum(shifts) {
      let sum = 0;
      shifts.forEach((shift) => {
        sum += shift.duration;
      });
      return "| " + minutesToHHMM(sum, "") + "h";
    }
  }
};
</script>