<template>
  <ShiftListItem :editable="true" :shift="shift">
    <template #actions>
      <v-list-item-action>
        <ShiftFormDialog icon :shift="shift"></ShiftFormDialog>
      </v-list-item-action>
      <v-list-item-action>
        <v-btn icon color="success" :disabled="!valid">
          <v-icon> {{ icons.mdiCheck }}</v-icon>
        </v-btn>
      </v-list-item-action>
      <v-list-item-action-text> Review </v-list-item-action-text>
    </template>
  </ShiftListItem>
</template>

<script>
import ShiftListItem from "@/components/shifts/ShiftListItem";
import ShiftFormDialog from "@/components/forms/dialogs/ShiftFormDialog";
import { mdiCheck } from "@mdi/js";
import { Shift } from "@/models/ShiftModel";
import ShiftValidationMixin from "@/mixins/ShiftValidationMixin";
export default {
  name: "ReviewShiftListItem",
  components: { ShiftFormDialog, ShiftListItem },
  mixins: [ShiftValidationMixin],
  props: {
    shift: {
      type: Shift,
      required: true
    }
  },
  data() {
    return {
      icons: {
        mdiCheck
      },
      newShift: this.shift
    };
  },
  watch: {
    shift(val) {
      this.newShift = val;
    }
  },
  created() {
    this.newShift = this.shift;
  }
};
</script>

<style scoped></style>
