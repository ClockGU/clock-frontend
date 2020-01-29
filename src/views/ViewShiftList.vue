<template>
  <v-row justify="center">
    <v-col cols="12" md="6" class="py-0">
      <v-card :elevation="$vuetify.breakpoint.smAndDown ? 0 : null">
        <portal-target
          v-if="shiftsOfContract.length !== 0"
          name="card-toolbar"
        ></portal-target>

        <portal
          :to="$vuetify.breakpoint.smAndDown ? 'app-bar' : 'card-toolbar'"
        >
          <v-toolbar slot-scope="{ action }" :elevation="0">
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

            <v-toolbar-title>
              {{
                shiftsToDelete.length
                  ? `${shiftsToDelete.length} selected`
                  : "Shifts"
              }}
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <v-scale-transition>
              <v-btn
                v-if="!deleteDisabled && shiftsToDelete.length === 1"
                key="export"
                icon
                :to="{
                  name: 'editShift',
                  params: { uuid: shiftsToDelete[0].uuid }
                }"
              >
                <v-icon>{{ icons.mdiPencil }}</v-icon>
              </v-btn>
            </v-scale-transition>

            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on }">
                <v-scale-transition>
                  <v-btn v-if="!deleteDisabled" key="delete" icon v-on="on">
                    <v-icon>{{ icons.mdiDelete }}</v-icon>
                  </v-btn>
                </v-scale-transition>
              </template>

              <v-card data-cy="delete-dialog">
                <v-card-title>
                  <span class="headline">Delete shifts?</span>
                </v-card-title>

                <v-card-text>
                  Are you sure you want to delete the selected shifts? This
                  action is permanent.
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    data-cy="delete-confirm"
                    color="error"
                    text
                    @click="destroy"
                  >
                    Delete
                  </v-btn>
                  <v-btn data-cy="delete-cancel" text @click="dialog = false">
                    Cancel
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-btn icon>
              <v-icon>{{ icons.mdiDotsVertical }}</v-icon>
            </v-btn>
          </v-toolbar>
        </portal>

        <v-card-text class="pa-0">
          <v-skeleton-loader
            data-cy="shift-list-skeleton"
            :loading="loading"
            transition="fade-transition"
            type="table"
          >
            <div data-cy="shift-lists">
              <ShiftList
                v-for="(shifts, key, i) in shiftsByMonth"
                :key="key"
                :data-cy="'shift-list-' + key"
                :title="key"
                :shifts="shifts"
                :editable="true"
                :show-divider="i + 1 < numberOfMonths"
                :shifts-to-delete="shiftsToDelete"
                @newSelection="handleSelection(key, $event)"
                @resetSelection="resetSelection(key)"
              />
            </div>
          </v-skeleton-loader>

          <div
            v-if="shiftsOfContract.length === 0"
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
        </v-card-text>
      </v-card>
    </v-col>

    <TheFAB />
  </v-row>
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
  mdiPencilOff,
  mdiClose,
  mdiExportVariant,
  mdiDotsVertical,
  mdiMenu
} from "@mdi/js";

import { format, parseISO } from "date-fns";
import { Shift } from "@/models/ShiftModel";
import ShiftService from "@/services/shift";
import { handleApiError } from "@/utils/interceptors";
import TheFAB from "@/components/TheFAB";

function datesGroupByComponent(dates, token) {
  return dates.reduce(function(val, obj) {
    let comp = format(parseISO(obj["date"]["start"]), token);
    (val[comp] = val[comp] || []).push(new Shift(obj));
    return val;
  }, {});
}

export default {
  name: "ViewShiftList",
  components: { TheFAB, ShiftList, UndrawWorkTime },
  data: () => ({
    dialog: false,
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
