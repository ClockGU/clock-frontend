<template>
  <v-data-table
    v-model="selected"
    data-cy="shift-table"
    :headers="headers"
    :items="items"
    :sort-by="['fullDate']"
    :sort-desc="[true]"
    :loading="loading"
    item-key="uuid"
    show-select
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-btn
          data-cy="shift-edit"
          text
          :disabled="selected.length != 1 || exportedInSelected.length > 0"
          @click="editShift"
        >
          Edit
        </v-btn>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn
              data-cy="shift-delete"
              text
              :disabled="selected.length == 0 || exportedInSelected.length > 0"
              v-on="on"
            >
              {{ deleteLabel }}
            </v-btn>
          </template>

          <v-card data-cy="delete-dialog">
            <v-card-title>
              <span class="headline">Delete shifts?</span>
            </v-card-title>

            <v-card-text>
              Are you sure you want to delete the selected shifts? This action
              is permanent.
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
        <v-spacer />
        <span>
          Work time sum: {{ totalDuration | minutesToDuration }} /
          {{ debit | hoursToWorktime }}
        </span>
      </v-toolbar>
    </template>
  </v-data-table>
</template>

<script>
import { format } from "date-fns";
import { Shift } from "@/models/ShiftModel";
import ShiftService from "@/services/shift";
import { minutesToHHMM } from "@/utils/time";

export default {
  name: "ShiftTable",
  filters: {
    minutesToDuration(value) {
      return minutesToHHMM(value);
    },
    hoursToWorktime(value) {
      const hours = Math.floor(value);
      const minutes = parseInt((60 * (value - hours)).toFixed(0));

      return `${hours.pad(2)}:${minutes.pad(2)}`;
    }
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    shifts: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dialog: false,
      selected: [],
      headers: [
        {
          text: "Date",
          value: "date"
        },
        {
          text: "Start",
          value: "start"
        },
        {
          text: "End",
          value: "end"
        },
        {
          text: "Duration",
          value: "duration"
        },
        {
          text: "Type",
          value: "type"
        }
      ]
    };
  },
  computed: {
    debit() {
      return this.$store.state.selectedContract.hours.toFixed(1);
    },
    totalDuration() {
      return this.items.reduce(
        (acc, current) => acc + current["minuteDuration"],
        0
      );
    },
    visibleShifts() {
      if (this.shifts === null) return [];

      return this.shifts.filter(
        shift => shift.contract === this.$store.state.selectedContract.uuid
      );
    },
    exportedInSelected() {
      return this.selected.filter(shift => shift.exported === true);
    },
    deleteLabel() {
      if (this.selected.length == 0) return "Delete";

      const shift = this.selected.length > 1 ? "shifts" : "shift";

      return `Delete (${this.selected.length} ${shift})`;
    },
    items() {
      if (this.visibleShifts === null) return [];

      return this.visibleShifts.map(item => {
        const shift = new Shift(item);

        return {
          minuteDuration: shift.duration,
          duration: shift.representationalDuration("hm"),
          date: this.formatDate(shift.start),
          start: this.formatTime(shift.start),
          end: this.formatTime(shift.end),
          type: shift.type.text,
          fullDate: this.formatDate(shift.start, "yyyy'-'MM'-'dd"),
          uuid: shift.uuid,
          exported: shift.exported
        };
      });
    }
  },
  methods: {
    editShift() {
      this.$router.push({
        name: "editShift",
        params: { uuid: this.selected[0].uuid }
      });
    },
    destroy() {
      const promises = [];
      for (const shift of this.selected) {
        promises.push(ShiftService.delete(shift.uuid));
      }

      Promise.all(promises)
        .catch(error => {
          this.$store.dispatch("snackbar/setSnack", {
            snack: error.message,
            timeout: 0,
            color: "error"
          });
        })
        .finally(() => {
          this.$emit("delete");
          this.dialog = false;
          this.selected = [];
        });
    },
    formatDate(date, formatString = "do MMMM yyyy") {
      if (date === undefined) return;
      return format(date, formatString);
    },
    formatTime(date, formatString = "HH:mm") {
      if (date === undefined) return;
      return format(date, formatString);
    }
  }
};
</script>
