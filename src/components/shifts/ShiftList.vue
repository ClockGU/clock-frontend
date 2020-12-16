<template>
  <v-list>
    <v-subheader>
      <v-checkbox
        v-if="editable"
        data-cy="shift-list-toggle-all"
        :disabled="!editable || hasExportedShifts"
        :value="hasSelectedAllShifts"
        :indeterminate="isIndeterminate"
        @change="toggle"
      ></v-checkbox>
      <v-row class="ml-3">
        <v-col cols="12">
          <span class="text-h6">
            {{ title | formatHeader }}
          </span>
          <br />
          Work time sum: {{ totalDuration | minutesToDuration }} /
          {{ debit | minutesToWorktime }}
        </v-col>

        <v-col
          v-if="hasExportedShifts"
          cols="12"
          sm="6"
          class="d-flex align-end flex-column"
        >
          <v-chip dark color="green" label>Exported</v-chip>
        </v-col>
      </v-row>
    </v-subheader>

    <v-list-item-group
      v-model="selected"
      data-cy="shift-list-group"
      multiple
      color="primary"
    >
      <template v-for="(item, index) in shifts">
        <ShiftListItem
          :key="index"
          :data-cy="'shift-list-item-' + index"
          :editable="editable"
          :item="item"
          :toggle="toggle"
        />
      </template>

      <v-divider v-if="showDivider"></v-divider>
    </v-list-item-group>
  </v-list>
</template>

<script>
import { localizedFormat } from "@/utils/date";
import { minutesToHHMM } from "@/utils/time";
import ShiftListItem from "@/components/shifts/ShiftListItem";

export default {
  name: "ShiftList",
  filters: {
    formatHeader(text) {
      const [year, month] = text.split(" ");
      const date = new Date(year, month - 1, 1);

      return localizedFormat(date, "MMMM yyyy");
    },
    minutesToDuration(value) {
      return minutesToHHMM(value);
    },
    minutesToWorktime(value) {
      const hours = Math.floor(value / 60);
      const minutes = value % 60;

      return `${hours.pad(2)}:${minutes.pad(2)}`;
    }
  },
  components: { ShiftListItem },
  props: {
    editable: {
      type: Boolean,
      required: true
    },
    shifts: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    showDivider: {
      type: Boolean,
      required: true
    },
    shiftsToDelete: {
      type: Array,
      required: true
    },
    selectedContract: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    selected: []
  }),
  computed: {
    debit() {
      return this.selectedContract.minutes;
    },
    totalDuration() {
      return this.shifts.reduce((acc, current) => acc + current.duration, 0);
    },
    hasSelectedShifts() {
      return this.selected.length > 0;
    },
    hasSelectedAllShifts() {
      return this.selected.length === this.shifts.length;
    },
    isIndeterminate() {
      return this.hasSelectedShifts && !this.hasSelectedAllShifts;
    },
    hasExportedShifts() {
      return this.shifts.map((shift) => shift.locked).every((item) => !!item);
    }
  },
  watch: {
    shiftsToDelete: function (newValue, oldValue) {
      if (oldValue === undefined) return;
      if (newValue.length > 0) return;
      if (this.selected.length === 0) return;

      this.deselectAll();
    },
    editable: function (newValue, oldValue) {
      // noop if oldValue is undefined (=component just initialized)
      if (oldValue === undefined) return;

      // deselect everything, when we exit edit mode
      if (newValue !== true) {
        this.deselectAll();
      }
    },
    selected: function (newValue, oldValue) {
      // If we did not just initialize and the length is zero: reset
      if (oldValue.length !== 0 && newValue.length === 0) {
        this.$emit("resetSelection");
        return;
      }

      // If length is bigger than zero, communicate new selection
      if (newValue.length > 0) {
        this.$emit("newSelection", this.selected);
        return;
      }
    }
  },
  methods: {
    deselectAll() {
      this.selected = [];
    },
    selectAll() {
      this.selected = Array(...Array(this.shifts.length)).map((_, i) => i);
    },
    toggle() {
      if (this.hasSelectedAllShifts) {
        this.deselectAll();
      } else {
        this.selectAll();
      }
    }
  }
};
</script>
