<template>
  <div>
    <v-skeleton-loader
      v-if="loading"
      data-cy="shift-list-skeleton"
      loading="true"
      transition="fade-transition"
      type="table"
    >
    </v-skeleton-loader>

    <div v-else-if="shiftsOfContract.length > 0" data-cy="shift-lists">
      <v-btn
        data-cy="shift-list-edit-mode-button"
        text
        :outlined="editable"
        @click="toggleEdit"
      >
        <v-icon v-if="!editable" left>{{ icons.mdiPencil }}</v-icon>
        <v-icon v-else left>{{ icons.mdiPencilOff }}</v-icon>
        Edit mode
      </v-btn>

      <v-dialog v-model="dialog" max-width="500px">
        <template v-slot:activator="{ on }">
          <v-slide-x-transition>
            <v-btn
              v-if="editable"
              data-cy="shift-list-delete-button"
              text
              :disabled="deleteDisabled"
              v-on="on"
            >
              {{ deleteLabel }}
            </v-btn>
          </v-slide-x-transition>
        </template>

        <v-card data-cy="delete-dialog">
          <v-card-title>
            <span class="headline">Delete shifts?</span>
          </v-card-title>

          <v-card-text>
            Are you sure you want to delete the selected shifts? This action is
            permanent.
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn data-cy="delete-confirm" color="error" text @click="destroy">
              Delete
            </v-btn>
            <v-btn data-cy="delete-cancel" text @click="dialog = false">
              Cancel
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <ShiftList
        v-for="(shifts, key) in shiftsByMonth"
        :key="key"
        :data-cy="'shift-list-' + key"
        :title="key"
        :shifts="shifts"
        :editable="editable"
        @newSelection="handleSelection(key, $event)"
        @resetSelection="resetSelection(key)"
      />
    </div>

    <div
      v-else-if="shiftsOfContract.length === 0"
      data-cy="shift-list-empty-placeholder"
    >
      <v-container fluid>
        <v-row justify="center">
          <p>You have not created any shifts yet. Get to work!</p>
        </v-row>
        <v-row justify="center">
          <UndrawWorkTime height="200" />
        </v-row>
      </v-container>
    </div>

    <portal to="fab">
      <v-btn
        absolute
        dark
        fab
        top
        right
        color="secondary"
        data-cy="shift-create-button"
        :to="{ name: 'createShift' }"
      >
        <v-icon>{{ icons.mdiPlus }}</v-icon>
      </v-btn>
    </portal>
  </div>
</template>

<script>
import ShiftList from "@/components/shifts/ShiftList";
import UndrawWorkTime from "vue-undraw/UndrawWorkTime";

import { mapGetters } from "vuex";
import {
  mdiPlus,
  mdiDelete,
  mdiDeleteOff,
  mdiPencil,
  mdiPencilOff
} from "@mdi/js";

import { format, parseISO } from "date-fns";
import { Shift } from "@/models/ShiftModel";
import ShiftService from "@/services/shift";
import { handleApiError } from "@/utils/interceptors";

function datesGroupByComponent(dates, token) {
  return dates.reduce(function(val, obj) {
    let comp = format(parseISO(obj["date"]["start"]), token);
    (val[comp] = val[comp] || []).push(new Shift(obj));
    return val;
  }, {});
}

export default {
  name: "ViewShiftList",
  components: { ShiftList, UndrawWorkTime },
  data: () => ({
    dialog: false,
    editable: false,
    icons: { mdiPlus, mdiDelete, mdiDeleteOff, mdiPencil, mdiPencilOff },
    toDelete: null, // We do not want to watch this object, so we use a slightly different solution,
    shiftsToDelete: [],
    unsortedShifts: []
  }),
  computed: {
    ...mapGetters({
      shifts: "shift/shifts",
      loading: "shift/loading",
      selectedContract: "selectedContract",
      shiftsOfContract: "shift/shiftsOfContract"
    }),
    shiftsByMonth() {
      return datesGroupByComponent(this.sortedShifts, "y MM");
    },
    sortedShifts() {
      const unsorted = [...this.unsortedShifts];
      return unsorted.sort((a, b) => {
        return new Date(b.date.start) - new Date(a.date.start);
      });
    },
    deleteDisabled() {
      return this.shiftsToDelete.length === 0;
    },
    deleteLabel() {
      if (this.deleteDisabled) return "Delete";

      const shift = this.shiftsToDelete.length > 1 ? "shifts" : "shift";

      return `Delete (${this.shiftsToDelete.length} ${shift})`;
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
  mounted() {
    this.groupShiftsByMonth();
    this.$store.dispatch("contract/queryContracts");
  },
  methods: {
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
      this.$store.dispatch("shift/queryShifts").then(() => {
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
