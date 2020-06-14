<template>
  <base-layout
    alternative-portal-target="card-toolbar"
    col-classes="py-0"
    :card-elevation="$vuetify.breakpoint.smAndDown ? 0 : null"
  >
    <template v-slot:card-top>
      <portal-target
        v-if="shiftsOfContract.length !== 0"
        name="card-toolbar"
      ></portal-target>
    </template>

    <template v-slot:pre-toolbar-title="{ action }">
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

      <v-btn v-else icon disabled></v-btn>
    </template>

    <template v-slot:title>
      {{
        shiftsToDelete.length
          ? $t("forms.selected", { n: shiftsToDelete.length })
          : $tc("models.shift", 2)
      }}
    </template>

    <template v-slot:post-toolbar-title>
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
        <template v-slot:activator="{ on }">
          <v-scale-transition>
            <v-btn v-if="!deleteDisabled" key="delete" icon v-on="on">
              <v-icon>{{ icons.mdiDelete }}</v-icon>
            </v-btn>
          </v-scale-transition>
        </template>

        <template v-slot:title>
          {{ $t("buttons.deleteEntity", { entity: $tc("models.shift") }) }}
        </template>

        <template v-slot:text>
          {{
            $t(`dialogs.textConfirmDelete`, {
              selectedEntity: $tc(`models.selectedShift`)
            })
          }}
        </template>
      </ConfirmationDialog>

      <v-btn icon>
        <v-icon>{{ icons.mdiDotsVertical }}</v-icon>
      </v-btn>
    </template>

    <template v-slot:content>
      <v-skeleton-loader
        data-cy="shift-list-skeleton"
        :loading="loading && !ignoreLoading"
        transition="fade-transition"
        type="table"
      >
        <div data-cy="shift-lists">
          <SelectContractFilter
            :contracts="contracts"
            :selected-contract="selectedContract"
          />

          <v-btn color="primary" text @click="newShift">
            {{ $t("buttons.newEntity", { entity: $tc("models.shift") }) }}
          </v-btn>

          <ShiftList
            v-for="(shifts, key, i) in shiftsByMonth"
            :key="key"
            :data-cy="'shift-list-' + key"
            :title="key"
            :shifts="shifts"
            :editable="true"
            :show-divider="i + 1 < numberOfMonths"
            :shifts-to-delete="shiftsToDelete"
            :selected-contract="selectedContract"
            @newSelection="handleSelection(key, $event)"
            @resetSelection="resetSelection(key)"
          />
        </div>
      </v-skeleton-loader>

      <placeholder
        v-if="(!loading || ignoreLoading) && shiftsOfContract.length === 0"
        data-cy="shift-list-empty-placeholder"
        name="UndrawWorkTime"
      >
        {{ $t("shifts.empty") }}
      </placeholder>
    </template>

    <template v-slot:extra-content>
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
  mdiDotsVertical,
  mdiMenu
} from "@mdi/js";

import ShiftService from "@/services/shift";
import { handleApiError } from "@/utils/interceptors";

import { datesGroupByComponent } from "@/utils/shift";
import { getNextContractParams } from "@/utils";

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
      mdiDotsVertical,
      mdiMenu
    },
    toDelete: null, // We do not want to watch this object, so we use a slightly different solution,
    shiftsToDelete: [],
    unsortedShifts: [],
    shiftEntity: null,
    showFormDialog: false,
    ignoreLoading: false
  }),
  beforeRouteLeave(to, from, next) {
    this.ignoreLoading = true;

    next();
  },
  computed: {
    ...mapGetters({
      shifts: "shift/shifts",
      loading: "shift/loading",
      contracts: "contract/contracts"
    }),
    selectedContract() {
      const uuid = this.$route.params.contract;

      return this.contracts.find(contract => contract.uuid === uuid);
    },
    shiftsOfContract() {
      return this.shifts.filter(
        shift => shift.contract === this.selectedContract.uuid
      );
    },
    shiftsByMonth() {
      return datesGroupByComponent(this.sortedShifts, "y MM");
    },
    numberOfMonths() {
      return Object.keys(this.shiftsByMonth).length;
    },
    sortedShifts() {
      const unsorted = [...this.unsortedShifts];
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
      handler: function(value) {
        if (value === null) return;

        const arr = [];

        Object.entries(value).forEach(entry => {
          const [key, indices] = entry;
          indices.forEach(index => {
            arr.push(this.shiftsByMonth[key][index]);
          });
        });

        this.shiftsToDelete = arr;
      },
      deep: true
    }
  },
  created() {
    this.groupShiftsByMonth();
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
    destroy() {
      const promises = [];
      for (const shift of this.shiftsToDelete) {
        promises.push(ShiftService.delete(shift.uuid).catch(handleApiError));
      }

      Promise.all(promises).finally(() => {
        this.groupShiftsByMonth();
        this.dialog = false;
        this.editable = false;

        this.shiftsToDelete = [];
        this.toDelete = null;
      });
    },
    groupShiftsByMonth() {
      return this.$store.dispatch("shift/queryShifts").then(() => {
        this.unsortedShifts = this.shiftsOfContract;
      });
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
    toggleEdit() {
      this.editable = !this.editable;
    }
  }
};
</script>
