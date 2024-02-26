<template>
  <!-- TODO: we shold probably also use 'TheDialog' here -->
  <v-dialog v-model="dialog" :max-width="500">
    <template #activator="{ props }">
      <v-btn
        :disabled="shifts.length < 1"
        variant="text"
        block
        v-bind="props"
        >{{ $t("shifts.repeating.dialog.activator") }}</v-btn
      >
    </template>

    <v-card>
      <v-toolbar flat>
        <v-btn icon @click="dialog = false">
          <v-icon>{{ icons.mdiClose }}</v-icon>
        </v-btn>
        <v-toolbar-title
          >{{ $t("shifts.repeating.dialog.title") }}
        </v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <i18n path="shifts.repeating.dialog.text" tag="span">
          <template #numberOfShifts>
            <strong>{{ shifts.length }}</strong>
          </template>
        </i18n>
      </v-card-text>

      <v-card-text>
        <v-virtual-scroll
          bench="5"
          item-height="100"
          height="250"
          :items="shifts"
        >
          <template #default="{ item }">
            <ShiftListItem :shift="item" :editable="false" />
          </template>
        </v-virtual-scroll>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import ShiftListItem from "@/components/shifts/ShiftListItem.vue";
import { mdiClose } from "@mdi/js";

export default {
  name: "ShiftFormRepeatDialog",

  components: { ShiftListItem },
  props: {
    shifts: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    dialog: false,
    icons: {
      mdiClose
    }
  })
};
</script>
