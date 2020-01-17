<template>
  <v-list>
    <v-subheader>
      <v-checkbox
        v-if="editable"
        :disabled="!editable"
        :value="hasSelectedAllShifts"
        :indeterminate="isIndeterminate"
        @change="toggle"
      ></v-checkbox>
      <!-- <span class="ml-6"> -->
      <span :class="{ 'ml-6': editable }">
        {{ title | formatHeader }}
        <br />
        Work time sum: {{ totalDuration | minutesToDuration }} /
        {{ debit | hoursToWorktime }}
      </span>
    </v-subheader>

    <v-list-item-group v-model="selected" multiple color="primary">
      <template v-for="(item, index) in shifts">
        <ShiftListItem
          :key="index"
          :editable="editable"
          :item="item"
          :active="active"
          :toggle="toggle"
        />
      </template>

      <v-divider v-if="index + 1 < shifts.length" :key="index"></v-divider>
    </v-list-item-group>
  </v-list>
</template>

<script>
import { format } from "date-fns";

import { mapGetters } from "vuex";

import { minutesToHHMM } from "@/utils/time";
import ShiftListItem from "@/components/shifts/ShiftListItem";

export default {
  name: "ShiftList",
  filters: {
    formatHeader(text) {
      const [year, month] = text.split(" ");
      const date = new Date(year, month - 1, 1);

      return format(date, "MMMM yyyy");
    },
    minutesToDuration(value) {
      return minutesToHHMM(value);
    },
    hoursToWorktime(value) {
      const hours = Math.floor(value);
      const minutes = parseInt((60 * (value - hours)).toFixed(0));

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
      type: Object,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  },
  data: () => ({
    selected: []
  }),
  computed: {
    ...mapGetters({
      selectedContract: "selectedContract"
    }),
    debit() {
      return this.selectedContract.hours.toFixed(1);
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
    }
  },
  watch: {
    editable: function(newValue, oldValue) {
      // noop if oldValue is undefined (=component just initialized)
      if (oldValue === undefined) return;

      // deselect everything, when we exit edit mode
      if (newValue !== true) {
        this.deselectAll();
      }
    },
    selected: function(newValue, oldValue) {
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
