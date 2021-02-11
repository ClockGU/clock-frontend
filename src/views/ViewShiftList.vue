<template>
  <base-layout alternative-portal-target="card-toolbar">
    <template #card-top>
      <portal-target name="card-toolbar"></portal-target>
    </template>

    <template #pre-toolbar-title="{ action }">
      <v-app-bar-nav-icon
        v-if="$vuetify.breakpoint.smAndDown && !shiftsToDelete.length"
        icon
        @click="action"
      ></v-app-bar-nav-icon>

      <v-btn
        v-else-if="!!shiftsToDelete.length"
        icon
        @click="shiftsToDelete = []"
      >
        <v-icon>{{ icons.mdiClose }}</v-icon>
      </v-btn>
    </template>

    <template #title>
      {{
        shiftsToDelete.length
          ? $t("forms.selected", { n: shiftsToDelete.length })
          : $tc("models.shift", 2)
      }}
    </template>

    <template #post-toolbar-title>
      <v-spacer></v-spacer>

      <v-scale-transition>
        <v-btn
          v-if="!deleteDisabled && shiftsToDelete.length === 1"
          key="export"
          icon
          @click="editShift"
        >
          <v-icon>{{ icons.mdiPencil }}</v-icon>
        </v-btn>
      </v-scale-transition>

      <ConfirmationDialog @confirm="destroy">
        <template #activator="{ on }">
          <v-scale-transition>
            <v-btn v-if="!deleteDisabled" key="delete" icon v-on="on">
              <v-icon>{{ icons.mdiDelete }}</v-icon>
            </v-btn>
          </v-scale-transition>
        </template>

        <template #title>
          {{ $t("buttons.deleteEntity", { entity: $tc("models.shift") }) }}
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

    <template #content>
      <v-skeleton-loader
        data-cy="shift-list-skeleton"
        :loading="loading && !ignoreLoading"
        transition="fade-transition"
        type="table"
      >
        <v-container data-cy="shift-lists">
          <v-row class="py-2">
            <SelectContractFilter
              :contracts="contracts"
              :selected-contract="selectedContract"
              @update="resetSelections"
            />
          </v-row>

          <v-row class="pb-6">
            <v-btn
              color="primary"
              :disabled="contractExpired"
              @click="newShift"
            >
              {{ $t("buttons.newEntity", { entity: $tc("models.shift") }) }}
            </v-btn>
          </v-row>

          <v-alert v-if="contractExpired" type="error" class="mt-6">
            {{ $t("dashboard.contractExpired.text") }}
          </v-alert>

          <v-row>
            <ShiftList
              v-for="(shifts, key, i) in shiftsByMonth"
              :key="key"
              :data-cy="'shift-list-' + key"
              :title="key"
              :shifts="shifts"
              :editable="!contractExpired"
              :show-divider="i + 1 < numberOfMonths"
              :shifts-to-delete="shiftsToDelete"
              :selected-contract="selectedContract"
              @newSelection="handleSelection(key, $event)"
              @resetSelection="resetSelection(key)"
            />
          </v-row>
        </v-container>
      </v-skeleton-loader>

      <placeholder
        v-if="(!loading || ignoreLoading) && shiftsOfContract.length === 0"
        data-cy="shift-list-empty-placeholder"
        name="UndrawWorkTime"
      >
        {{ $t("shifts.empty") }}
      </placeholder>
    </template>

    <template #extra-content>
      <FormDialog
        v-if="showFormDialog"
        entity-name="shift"
        :entity="shiftEntity"
        @close="closeFormDialog"
        @refresh="refresh"
      />
    </template>
  </base-layout>
</template>

<script>
import ShiftList from "@/components/shifts/ShiftList";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import FormDialog from "@/components/FormDialog";
import SelectContractFilter from "@/components/SelectContractFilter";
import { Shift } from "@/models/ShiftModel";

import { mapGetters } from "vuex";
import {
  mdiPlus,
  mdiDelete,
  mdiDeleteOff,
  mdiPencil,
  mdiPencilOff,
  mdiClose,
  mdiExportVariant,
  mdiMenu
} from "@mdi/js";

import ShiftService from "@/services/shift";
import { log } from "@/utils/log";

import { datesGroupByComponent } from "@/utils/shift";
import { getNextContractParams } from "@/utils";

// import contractExpiredMixin from "@/mixins/contractExpired";

export default {
  name: "ViewShiftList",
  metaInfo() {
    return {
      title: this.$t("app.shifts")
    };
  },
  components: {
    ConfirmationDialog,
    ShiftList,
    FormDialog,
    SelectContractFilter
  },
  beforeRouteLeave(to, from, next) {
    this.ignoreLoading = true;

    next();
  },
  // mixins: [contractExpiredMixin],
  data: () => ({
    editable: false,
    icons: {
      mdiPlus,
      mdiDelete,
      mdiDeleteOff,
      mdiPencil,
      mdiPencilOff,
      mdiClose,
      mdiExportVariant,
      mdiMenu
    },
    toDelete: null, // We do not want to watch this object, so we use a slightly different solution,
    shiftsToDelete: [],
    shiftEntity: null,
    showFormDialog: false,
    ignoreLoading: false
  }),
  computed: {
    ...mapGetters({
      shifts: "shift/shifts",
      loading: "shift/loading",
      contracts: "contract/contracts"
    }),
    contractExpired() {
      return false;
    },
    selectedContract() {
      const uuid = this.$route.params.contract;

      return this.contracts.find((contract) => contract.uuid === uuid);
    },
    shiftsOfContract() {
      return this.shifts.filter(
        (shift) => shift.contract === this.selectedContract.uuid
      );
    },
    shiftsByMonth() {
      return datesGroupByComponent(this.sortedShifts, "y MM");
    },
    numberOfMonths() {
      return Object.keys(this.shiftsByMonth).length;
    },
    sortedShifts() {
      const unsorted = [...this.shiftsOfContract];
      return unsorted.sort((a, b) => {
        return new Date(b.date.start) - new Date(a.date.start);
      });
    },
    deleteDisabled() {
      return this.shiftsToDelete.length === 0;
    }
  },
  watch: {
    toDelete: {
      handler: function (value) {
        if (value === null) return;

        const arr = [];

        Object.entries(value).forEach((entry) => {
          const [key, indices] = entry;
          indices.forEach((index) => {
            arr.push(this.shiftsByMonth[key][index]);
          });
        });

        this.shiftsToDelete = arr;
      },
      deep: true
    }
  },
  methods: {
    async refresh({ contract }) {
      if (this.$route.params.contract !== contract) {
        await this.$router.replace(
          getNextContractParams(this.$route, contract)
        );
      }
      this.groupShiftsByMonth();
    },
    editShift() {
      this.shiftEntity = new Shift(this.shiftsToDelete[0]);
      this.showFormDialog = true;
      this.shiftsToDelete = [];
    },
    newShift() {
      this.showFormDialog = true;
      this.shiftsToDelete = [];
    },
    closeFormDialog() {
      this.showFormDialog = false;
      this.shiftEntity = null;
    },
    async destroy() {
      const promises = [];
      try {
        for (const shift of this.shiftsToDelete) {
          promises.push(ShiftService.delete(shift.uuid));
        }

        await Promise.all(promises);
        await this.groupShiftsByMonth();
        this.dialog = false;
        this.editable = false;

        this.resetSelections();
      } catch (error) {
        // TODO: Set error state for component & allow user to reload page
        // We usually should end up here, if we are already logging out.
        // But a proper error state could mitigate further issues.
        log(error);
      }
    },
    async groupShiftsByMonth() {
      return await this.$store.dispatch("shift/queryShifts");
    },
    handleSelection(key, event) {
      // Initialize, if this is our first time
      if (this.toDelete === null) {
        this.toDelete = {};
      }

      this.toDelete = { ...this.toDelete, [key]: event };
    },
    resetSelection(key) {
      // eslint-disable-next-line no-unused-vars
      const { [key]: value, ...withoutRemoved } = this.toDelete;
      this.toDelete = { ...withoutRemoved };
    },
    resetSelections() {
      this.shiftsToDelete = [];
      this.toDelete = null;
    },
    toggleEdit() {
      this.editable = !this.editable;
    }
  }
};
</script>
