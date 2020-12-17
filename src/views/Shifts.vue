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
                :shifts="data.reviewedShifts"
                :search="reviewedSearch"
                @edit="editShift"
                @refresh="refresh"
              >
                <template #head="{ selected }">
                  <v-card-title>
                    <v-row>
                      <v-col cols="12" md="5">
                        <span>Abgeschlossene Schichten</span>
                      </v-col>

                      <v-col v-if="selected.length > 0" cols="12" sm="3">
                        <ShiftBulkActions
                          :shifts="selected"
                          @refresh="refresh"
                        />
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
                          v-model="reviewedSearch"
                          :append-icon="icons.mdiMagnify"
                          :label="$t('actions.search')"
                          dense
                          hide-details
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-card-title>

                  <v-card-text>
                    Alle Schichten die du abgeschlossen hast. Alle Schichten die
                    ursprünglich nicht für die Zukunft geplant wurden werden als
                    "Überprüft" markiert.
                  </v-card-text>
                </template>
              </ShiftsTable>

              <ShiftsTable
                :shifts="data.unreviewedShifts"
                :loading="loading"
                :search="unreviewedSearch"
                @edit="editShift"
                @refresh="refresh"
              >
                <template #head="{ selected }">
                  <v-card-title>
                    <v-row>
                      <v-col cols="12" md="5">
                        <span>Geplante Schichten</span>
                      </v-col>

                      <v-col v-if="selected.length > 0" cols="12" sm="3">
                        <ShiftBulkActions
                          :shifts="selected"
                          @refresh="refresh"
                        />
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
                          v-model="unreviewedSearch"
                          :append-icon="icons.mdiMagnify"
                          :label="$t('actions.search')"
                          dense
                          hide-details
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-card-title>

                  <v-card-text>
                    Alle deine geplanten Schichten und unbestätigten Schichten.
                    Sobald du eine geplante Schicht abgeschlossen hast kannst du
                    diese hier überprüfen.
                  </v-card-text>
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
import ShiftBulkActions from "@/components/ShiftBulkActions";
import ShiftsTable from "@/components/shifts/ShiftsTable";

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
    reviewedSearch: "",
    unreviewedSearch: ""
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

      this.refresh();
    },
    processShifts(shift) {
      const shiftModel = new Shift(shift);

      return {
        date: localizedFormat(shiftModel.date.start, "EEEE',' do' 'MMMM"),
        start: localizedFormat(shiftModel.date.start, "HH:mm"),
        end: localizedFormat(shiftModel.date.end, "HH:mm"),
        duration: shiftModel.representationalDuration(),
        type: this.$t(`shifts.types.${shiftModel.type.value}`),
        reviewed: shiftModel.reviewed,
        uuid: shiftModel.uuid,
        shift: shiftModel,
        contract: shiftModel.contract
      };
    },
    updateDate(value) {
      this.date = value;
    },
    async refresh() {
      this.loading = true;

      await Promise.all([
        this.$store.dispatch("shift/queryShifts"),
        this.$store.dispatch("contract/queryContracts"),
        this.$store.dispatch("report/list")
      ]);

      this.loading = false;
    }
  }
};
</script>
