<template>
  <v-list-item v-bind="$attrs" :aria-label="ariaLabel">
    <v-list-item-title
      :class="error ? 'error--text' : 'text--primary'"
      aria-hidden="true"
    >
      <v-icon class="pr-1" :color="colors[shift.type]" aria-hidden="true">
        {{ typeIcons[shift.type] }}
      </v-icon>
      {{ formatDay(shift.started) }}
    </v-list-item-title>
    <v-list-item-subtitle
      :class="error ? 'error--text' : 'text--primary'"
      aria-hidden="true"
    >
      {{ formatTime(shift.started) }} -
      {{ formatTime(shift.stopped) }}
      ({{ shift.representationalDuration("hm") }})
    </v-list-item-subtitle>
    <v-list-item-subtitle aria-hidden="true">
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
    <template #append="props">
      <slot name="actions" v-bind="props"></slot>
    </template>
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
    },
    ariaLabel() {
      const day = this.formatDay(this.shift.started);
      const startTime = this.formatTime(this.shift.started);
      const stopTime = this.formatTime(this.shift.stopped);
      const duration = this.shift.representationalDuration("hm");

      const shiftTypeString = this.shift.type
        ? this.$t(`aria.shift.${this.shift.type}`)
        : "";
      const dayString = day
        ? this.$t("aria.shiftListItem.day", { day: day })
        : "";
      const startDateString = startTime
        ? this.$t("aria.shiftListItem.startTime", { startTime: startTime })
        : "";
      const stopDateString = stopTime
        ? this.$t("aria.shiftListItem.stopTime", { stopTime: stopTime })
        : "";
      const durationString = duration
        ? this.$t("aria.shiftListItem.duration", { duration: duration })
        : "";
      const tagsKey = this.shift.tags.length
        ? "aria.shiftListItem.tagsPrefix"
        : "";
      const reviewKey =
        !this.shift.wasReviewed && !this.hideReviewedChip
          ? "aria.shiftListItem.notReviewed"
          : "";
      const liveKey = this.isRunningShift ? "aria.shiftListItem.live" : "";
      const tags = tagsKey
        ? this.$t(tagsKey, { tags: this.shift.tags.join(", ") })
        : "";
      const reviewStatus = reviewKey ? this.$t(reviewKey) : "";
      const liveStatus = liveKey ? this.$t(liveKey) : "";

      const finalAriaLabel =
        shiftTypeString +
        dayString +
        startDateString +
        stopDateString +
        durationString +
        tags +
        reviewStatus +
        liveStatus;
      return finalAriaLabel;
    }
  },
  methods: {
    formatDay(date) {
      return localizedFormat(date, "EEEE',' do MMMM yyyy");
    },
    formatDate(date) {
      return localizedFormat(date, "dd'.'MM'.' HH':'mm");
    },
    formatTime(date) {
      return localizedFormat(date, "HH':'mm");
    }
  }
};
</script>
