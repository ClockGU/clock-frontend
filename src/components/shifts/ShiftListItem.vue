<template>
  <v-list-item @click="editable ? openDialog() : () => {}">
    <v-list-item-content>
      <v-list-item-title>
        <v-icon class="pr-1" :color="colors[item.type.value]">
          {{ typeIcons[item.type.value] }}
        </v-icon>
        {{ item.date.start | formatDay }}
      </v-list-item-title>
      <v-list-item-subtitle class="text--primary">
        {{ item.date.start | formatTime }} -
        {{ item.date.end | formatTime }}
        ({{ item.representationalDuration("hm") }})
      </v-list-item-subtitle>
      <v-list-item-subtitle>
        <v-chip
          v-if="isRunningShift"
          class="ml-0"
          outlined
          small
          dense
          color="red"
        >
          live
        </v-chip>
        <v-chip
          v-for="(tag, i) in item.tags"
          :key="tag"
          :data-cy="'shift-list-item-tag-' + i"
          outlined
          small
          class="ma-1 ml-0"
        >
          {{ tag }}
        </v-chip>

        <v-chip
          v-if="!item.reviewed"
          data-cy="shift-list-item-type"
          outlined
          small
          class="ma-1"
          color="warning"
        >
          {{ $t("dashboard.notYetReviewed") }}
        </v-chip>
      </v-list-item-subtitle>
    </v-list-item-content>

    <FormDialog
      v-if="dialog"
      entity-name="shift"
      :entity="shiftEntity"
      @close="closeDialog"
      @refresh="$emit('refresh')"
    />
  </v-list-item>
</template>

<script>
import { SHIFT_TYPE_COLORS } from "@/utils/colors";
import { SHIFT_TYPE_ICONS } from "@/utils/misc";

import { localizedFormat } from "@/utils/date";
import { isWithinInterval } from "date-fns";

import { mdiCircleMedium, mdiRecord } from "@mdi/js";

import FormDialog from "@/components/FormDialog";

export default {
  name: "ShiftListItem",
  components: { FormDialog },
  filters: {
    formatDay(date) {
      return localizedFormat(date, "EEEE',' do MMMM yyyy");
    },
    formatDate(date) {
      return localizedFormat(date, "dd'.'MM'.' HH':'mm");
    },
    formatTime(date) {
      return localizedFormat(date, "HH':'mm");
    }
  },
  props: {
    editable: {
      type: Boolean,
      required: true
    },
    item: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    dialog: false,
    shiftEntity: null,
    icons: { mdiCircleMedium, mdiRecord },
    colors: SHIFT_TYPE_COLORS,
    typeIcons: SHIFT_TYPE_ICONS
  }),
  computed: {
    isRunningShift() {
      return isWithinInterval(new Date(), {
        start: this.item.date.start,
        end: this.item.date.end
      });
    }
  },
  methods: {
    closeDialog() {
      this.shiftEntity = null;
      this.dialog = false;
      this.$emit("refresh");
    },
    openDialog() {
      this.shiftEntity = this.item;
      this.dialog = true;
    }
  }
};
</script>
