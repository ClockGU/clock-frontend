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

                  <v-col>
                    <ShiftBulkActions
                      v-if="selected.length > 0"
                      :shifts="selected"
                      @refresh="refresh"
                    />
                  </v-col>

                  <v-spacer></v-spacer>

                  <v-col cols="4">
                    <v-text-field
                      v-model="search"
                      :append-icon="icons.mdiMagnify"
                      label="Search"
                      single-line
                      hide-details
                      width="200"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-toolbar>

              <MonthSwitcher :data="data" :date="date" @update="updateDate" />

              <v-data-table
                v-model="selected"
                :headers="headers"
                :items="data.shifts"
                :search="search"
                :loading="loading"
                item-key="uuid"
                show-select
              >
                <!-- eslint-disable-next-line -->
                <template #item.reviewed="{ item }">
                  <v-icon v-if="item.reviewed" color="green">
                    {{ icons.mdiCheck }}
                  </v-icon>

                  <v-icon v-else color="red">
                    {{ icons.mdiClose }}
                  </v-icon>
                </template>

                <!-- eslint-disable-next-line -->
                <template v-slot:item.actions="{ item }">
                  <v-btn text @click="editShift(item.shift)">
                    <v-icon>
                      {{ icons.mdiPencil }}
                    </v-icon>
                  </v-btn>

                  <ConfirmationDialog @confirm="destroySingleShift(item)">
                    <template #activator="{ on }">
                      <v-scale-transition>
                        <v-btn text v-on="on">
                          <v-icon>
                            {{ icons.mdiDelete }}
                          </v-icon>
                        </v-btn>
                      </v-scale-transition>
                    </template>

                    <template #title>
                      {{
                        $t("buttons.deleteEntity", {
                          entity: $tc("models.shift")
                        })
                      }}
                    </template>

                    <template #text>
                      {{
                        $t(`dialogs.textConfirmDelete`, {
                          selectedEntity: $tc(`models.selectedShift`)
                        })
                      }}
                    </template>
                  </ConfirmationDialog>
                </template>
              </v-data-table>
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
import ConfirmationDialog from "@/components/ConfirmationDialog";
import DataFilter from "@/components/DataFilter";
import FormDialog from "@/components/FormDialog";
import MonthSwitcher from "@/components/MonthSwitcher";
import SelectContractFilter from "@/components/SelectContractFilter";
import ShiftBulkActions from "@/components/ShiftBulkActions";

import { mapGetters } from "vuex";
import { Shift } from "@/models/ShiftModel";

import ShiftService from "@/services/shift";
import { log } from "@/utils/log";

import { mdiCheck, mdiClose, mdiDelete, mdiMagnify, mdiPencil } from "@mdi/js";

export default {
  name: "Shifts",
  components: {
    ConfirmationDialog,
    DataFilter,
    FormDialog,
    MonthSwitcher,
    SelectContractFilter,
    ShiftBulkActions
  },
  data: () => ({
    icons: { mdiCheck, mdiClose, mdiDelete, mdiMagnify, mdiPencil },
    date: localizedFormat(new Date(), "yyyy-MM"),
    loading: false,
    shiftEntity: null,
    showFormDialog: false,
    search: "",
    selected: []
  }),
  computed: {
    ...mapGetters({
      contracts: "contract/contracts"
    }),
    headers() {
      return [
        {
          text: this.$t("time.date"),
          align: "start",
          sortable: true,
          value: "date"
        },
        {
          text: this.$t("time.start"),
          align: "start",
          sortable: true,
          value: "start"
        },
        {
          text: this.$t("time.end"),
          align: "start",
          sortable: true,
          value: "end"
        },
        {
          text: this.$t("time.duration"),
          align: "start",
          sortable: true,
          value: "duration"
        },
        {
          text: this.$t("calendar.type"),
          align: "start",
          sortable: false,
          value: "type"
        },
        {
          text: this.$t("time.reviewed"),
          align: "start",
          sortable: true,
          value: "reviewed"
        },
        { text: this.$t("actions.actions"), value: "actions", sortable: false }
      ];
    },
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
    async destroy() {
      const promises = [];
      try {
        for (const shift of this.selected) {
          promises.push(ShiftService.delete(shift.uuid));
        }

        await Promise.all(promises);

        this.refresh();
      } catch (error) {
        // TODO: Set error state for component & allow user to reload page
        // We usually should end up here, if we are already logging out.
        // But a proper error state could mitigate further issues.
        log(error);
      }
    },
    async destroySingleShift(shift) {
      try {
        await ShiftService.delete(shift.uuid);

        // this.dialog = false;
        this.refresh();
      } catch (error) {
        // TODO: Set error state for component & allow user to reload page
        // We usually should end up here, if we are already logging out.
        // But a proper error state could mitigate further issues.
        log(error);
      }
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
    resetSelection() {
      this.selected = [];
    },
    async refresh() {
      this.loading = true;

      await Promise.all([
        this.$store.dispatch("shift/queryShifts"),
        this.$store.dispatch("contract/queryContracts"),
        this.$store.dispatch("report/list")
      ]);

      this.resetSelection();
      this.loading = false;
    }
  }
};
</script>
