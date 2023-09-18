<template>
  <v-list-item v-on="$listeners">
    <v-list-item-title :class="error ? 'error--text' : 'text--primary'">
      <v-icon class="pr-1" :color="colors[shift.type]">
        {{ typeIcons[shift.type] }}
      </v-icon>
      {{ shift.started | formatDay }}
    </v-list-item-title>
    <v-list-item-subtitle :class="error ? 'error--text' : 'text--primary'">
      {{ shift.started | formatTime }} -
      {{ shift.stopped | formatTime }}
      ({{ shift.representationalDuration("hm") }})
    </v-list-item-subtitle>
    <v-list-item-subtitle>
      <v-chip
        v-if="isRunningShift"
        class="ml-0"
        variant="outlined"
        small
        dense
        color="red"
      >
        live
      </v-chip>
      <v-chip
        v-for="(tag, i) in shift.tags"
        :key="tag"
        :data-cy="'shift-list-shift-tag-' + i"
        variant="outlined"
        small
        class="ma-1 ml-0"
      >
        {{ tag }}
      </v-chip>

      <v-chip
        v-if="!shift.wasReviewed && !hideReviewedChip"
        data-cy="shift-list-shift-type"
        variant="outlined"
        small
        class="ma-1"
        color="warning"
      >
        {{ $t("dashboard.notYetReviewed") }}
      </v-chip>
    </v-list-item-subtitle>
    <slot name="extraSubtitle"></slot>

    <slot name="actions"></slot>
  </v-list-item>
</template>

<script>
import { SHIFT_TYPE_COLORS } from "@/utils/colors";
import { SHIFT_TYPE_ICONS } from "@/utils/misc";

import { localizedFormat } from "@/utils/date";
import { isWithinInterval } from "date-fns";

import { mdiCircleMedium, mdiRecord } from "@mdi/js";

import { Shift } from "@/models/ShiftModel";

export default {
  name: "ShiftListItem",
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
    shift: {
      type: Shift,
      required: true
    },
    error: {
      type: Boolean,
      required: false,
      default: false
    },
    hideReviewedChip: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data: () => ({
    icons: { mdiCircleMedium, mdiRecord },
    colors: SHIFT_TYPE_COLORS,
    typeIcons: SHIFT_TYPE_ICONS
  }),
  computed: {
    isRunningShift() {
      return isWithinInterval(new Date(), {
        start: this.shift.started,
        end: this.shift.stopped
      });
    }
  }
};
</script>
