<template>
  <div>
    <slot name="head" :destroy-fn="destroy" :selected="selected"></slot>
    <v-data-table
      v-model="selected"
      :headers="flexHeaders"
      :items="shifts"
      :search="search"
      :loading="loading"
      item-key="uuid"
      :custom-sort="sortByDate"
      must-sort
      :sort-desc="!pastShifts"
      show-select
    >
      <!-- eslint-disable-next-line -->
      <template #item.date="{ item }">
        {{ formattedDate(item.date) }}
      </template>

      <!-- eslint-disable-next-line -->
      <template #item.start="{ item }">
        {{ formattedTime(item.start) }}
      </template>

      <!-- eslint-disable-next-line -->
      <template #item.duration="{ item }">
        {{ formattedDuration(item.duration) }}
      </template>

      <!-- eslint-disable-next-line -->
      <template #item.type="{ item }">
        <v-icon :color="colors[item.shift.type.value]">
          {{ typeIcons[item.shift.type.value] }}
        </v-icon>
        <v-chip
          v-if="isRunningShift(item.shift)"
          class="ml-2"
          outlined
          x-small
          dense
          color="red"
        >
          live
        </v-chip>
      </template>

      <!-- eslint-disable-next-line -->
      <template v-if="pastShifts" #item.reviewed="{ item }">
        <v-btn
          v-if="!item.reviewed"
          :elevation="!isRunningShift(item.shift) ? 3 : 0"
          icon
          :disabled="isRunningShift(item.shift)"
          @click="reviewSingleShift(item.shift)"
        >
          <v-icon color="red">
            {{ icons.mdiClose }}
          </v-icon>
        </v-btn>
        <v-icon v-else color="green" class="pl-1">{{ icons.mdiCheck }}</v-icon>
      </template>

      <!-- eslint-disable-next-line -->
      <template v-else #item.reviewed="{ item }">
        <v-icon color="red">{{ icons.mdiClose }}</v-icon>
      </template>

      <!-- eslint-disable-next-line -->
      <template #item.tags="{ item }">
        <v-chip
          v-for="tag in item.tags.slice(0, 2)"
          :key="tag"
          class="mx-1"
          small
        >
          {{ tag }}
        </v-chip>
        <ShiftInfoDialog v-if="item.tags.length > 2" :item="item">
          <template #activator="{ on }">
            <v-chip small class="mx-1" v-on="on">...</v-chip>
          </template>
        </ShiftInfoDialog>
      </template>

      <!-- eslint-disable-next-line -->
      <template #item.note="{ item }">
        <ShiftInfoDialog :item="item">
          <template #activator="{ on }">
            <span on v-on="on">
              {{ noteDisplay(item.note) }}
            </span>
          </template>
        </ShiftInfoDialog>
      </template>

      <!-- eslint-disable-next-line-->
      <template #item.actions="{ item }">
        <v-btn icon @click="$emit('edit', item.shift)">
          <v-icon>
            {{ icons.mdiPencil }}
          </v-icon>
        </v-btn>
        <!--ShiftAssignContractDialog :shifts="[item]" @reset="$emit('refresh')">
          <template #activator="{ on }">
            <v-btn icon v-on="on">
              <v-icon>{{ icons.mdiSwapHorizontal }}</v-icon>
            </v-btn>
          </template>
        </ShiftAssignContractDialog-->

        <!--ConfirmationDialog @confirm="destroySingleShift(item)">
          <template #activator="{ on }">
            <v-scale-transition>
              <v-btn elevation="1" icon v-on="on">
                <v-icon>
                  {{ icons.mdiDelete }}
                </v-icon>
              </v-btn>
            </v-scale-transition>
          </template>

          <template #title>
            {{
              $t("buttons.deleteEntity", {
                entity: $tc("models.shift")
              })
            }}
          </template>

          <template #text>
            {{
              $t(`dialogs.textConfirmDelete`, {
                selectedEntity: $tc(`models.selectedShift`)
              })
            }}
          </template>
        </ConfirmationDialog-->
      </template>
    </v-data-table>
  </div>
</template>

<script>
//import ConfirmationDialog from "@/components/ConfirmationDialog";
//import ShiftAssignContractDialog from "@/components/shifts/ShiftAssignContractDialog";
import ShiftInfoDialog from "@/components/shifts/ShiftInfoDialog";

import { isWithinInterval, isBefore, getHours } from "date-fns";

import {
  mdiCheck,
  mdiClose,
  mdiCircleMedium,
  mdiTagOutline,
  mdiFileDocumentOutline,
  mdiPencil,
  mdiSwapHorizontal,
  mdiDelete
} from "@mdi/js";

import { SHIFT_TABLE_HEADERS } from "@/utils/misc";
import { SHIFT_TYPE_ICONS } from "@/utils/misc";

import { ShiftService } from "@/services/models";
import { log } from "@/utils/log";
import { SHIFT_TYPE_COLORS } from "@/utils/colors";
import { localizedFormat } from "@/utils/date";
import { minutesToHHMM } from "@/utils/time";

export default {
  name: "ShiftsTable",
  components: {
    //ConfirmationDialog,
    //  ShiftAssignContractDialog,
    ShiftInfoDialog
  },
  props: {
    loading: {
      type: Boolean,
      required: true
    },
    search: {
      type: String,
      default: ""
    },
    shifts: {
      type: Array,
      required: true
    },
    pastShifts: { type: Boolean, default: false }
  },
  data: () => ({
    icons: {
      mdiCheck,
      mdiClose,
      mdiCircleMedium,
      mdiTagOutline,
      mdiFileDocumentOutline,
      mdiPencil,
      mdiSwapHorizontal,
      mdiDelete
    },
    headers: SHIFT_TABLE_HEADERS,
    colors: SHIFT_TYPE_COLORS,
    typeIcons: SHIFT_TYPE_ICONS,
    selected: []
  }),
  computed: {
    flexHeaders() {
      //check for tags and notes and hide column if none exist
      let tagsAndNotes = 0;
      this.shifts.forEach(
        (shift) => (tagsAndNotes += shift.tags.length && shift.note.length)
      );
      if (tagsAndNotes == 0) {
        return this.headers.filter((item) => item.value != "tagsNotes");
      } else return this.headers;
    }
  },
  methods: {
    isRunningShift(shift) {
      return isWithinInterval(new Date(), {
        start: shift.date.start,
        end: shift.date.end
      });
    },
    formattedDate(date) {
      return localizedFormat(date, "EEEE',' do' 'MMMM");
    },
    formattedTime(time) {
      return localizedFormat(time, "HH:mm");
    },
    formattedDuration(duration) {
      return minutesToHHMM(duration, "");
    },
    sortByDate(items, sortBy, sortDesc) {
      const desc = sortDesc[0] ? -1 : 1;
      items.sort((a, b) => {
        switch (sortBy[0]) {
          case "date":
            return isBefore(b.date, a.date) ? -desc : desc;
          case "start":
            return isBefore(getHours(b.start), getHours(a.start))
              ? -desc
              : desc;
          default:
            return a[sortBy[0]] > b[sortBy[0]] ? -desc : desc;
        }
      });
      return items;
    },
    noteDisplay(note) {
      if (note.length > 15) {
        return note.substr(0, 15) + "...";
      } else return note;
    },
    async destroy() {
      const promises = [];
      try {
        for (const shift of this.selected) {
          promises.push(ShiftService.delete(shift.uuid));
        }

        await Promise.all(promises);

        this.$emit("refresh");
        this.reset();
      } catch (error) {
        // TODO: Set error state for component & allow user to reload page
        // We usually should end up here, if we are already logging out.
        // But a proper error state could mitigate further issues.
        log(error);
      }
    },
    async destroySingleShift(shift) {
      try {
        await ShiftService.delete(shift.uuid);

        this.$emit("refresh");
        this.reset();
      } catch (error) {
        // TODO: Set error state for component & allow user to reload page
        // We usually should end up here, if we are already logging out.
        // But a proper error state could mitigate further issues.
        log(error);
      }
    },
    async reviewSingleShift(shift) {
      const promises = [];
      try {
        shift.reviewed = true;
        const payload = shift.toPayload();
        promises.push(ShiftService.update(payload, payload.uuid));

        await Promise.all(promises);

        this.$emit("refresh");
      } catch (error) {
        // TODO: Set error state for component & allow user to reload page
        // We usually should end up here, if we are already logging out.
        // But a proper error state could mitigate further issues.
        log(error);
      }
    },
    reset() {
      this.selected = [];
    }
  }
};
</script>
