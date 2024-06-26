<template>
  <div>
    <slot name="head" :selected="selected" :reset="reset"></slot>
    <v-data-table
      v-model="selected"
      :headers="flexHeaders"
      :items="shifts"
      :search="search"
      :loading="loading"
      item-key="id"
      return-object
      hover
      :custom-sort="sortByDate"
      must-sort
      :sort-desc="!pastShifts"
      show-select
    >
      <!-- eslint-disable-next-line -->
      <template #item.date="{ item }">
        {{ formattedDate(item.started) }}
      </template>

      <!-- eslint-disable-next-line -->
      <template #item.start="{ item }">
        {{ formattedTime(item.started) }}
      </template>

      <!-- eslint-disable-next-line -->
      <template #item.duration="{ item }">
        {{ formattedDuration(item.duration) }}
      </template>

      <!-- eslint-disable-next-line -->
      <template #item.type="{ item }">
        <v-icon :color="colors[item.type]">
          {{ typeIcons[item.type] }}
        </v-icon>
        <v-chip
          v-if="isRunningShift(item)"
          class="ml-2"
          variant="outlined"
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
          v-if="!item.wasReviewed"
          :icon="icons.mdiClose"
          :disabled="isRunningShift(item)"
          color="red"
          variant="text"
          elevation="0"
          @click="reviewSingleShift(item)"
        >
        </v-btn>
        <v-btn
          v-else
          variant="text"
          :icon="icons.mdiCheck"
          color="green"
          elevation="0"
        >
        </v-btn>
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
          <template #activator="{ props }">
            <v-chip small class="mx-1" v-bind="props">...</v-chip>
          </template>
        </ShiftInfoDialog>
      </template>

      <!-- eslint-disable-next-line -->
      <template #item.note="{ item }">
        <ShiftInfoDialog :item="item">
          <template #activator="{ props }">
            <span v-bind="props">
              {{ noteDisplay(item.note) }}
            </span>
          </template>
        </ShiftInfoDialog>
      </template>

      <!-- eslint-disable-next-line-->
      <template #item.actions="{ item }">
        <ShiftFormDialog :create="false" icon :shift="item"></ShiftFormDialog>
        <!-- Commented out, pending due to missing Userfeedback.       -->
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
import ShiftInfoDialog from "@/components/shifts/ShiftInfoDialog.vue";

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
import ShiftFormDialog from "@/components/forms/dialogs/ShiftFormDialog.vue";

export default {
  name: "ShiftsTable",
  components: {
    ShiftFormDialog,
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
  emits: ["refresh"],
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
      if (tagsAndNotes === 0) {
        return this.headers.filter((item) => item.value !== "tagsNotes");
      }

      return this.headers;
    }
  },
  methods: {
    isRunningShift(shift) {
      return isWithinInterval(new Date(), {
        start: shift.started,
        end: shift.stopped
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
            return isBefore(b.started, a.started) ? -desc : desc;
          case "start":
            return isBefore(getHours(b.started), getHours(a.started))
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
    // async destroy() {
    //   const promises = [];
    //   try {
    //     for (const shift of this.selected) {
    //       promises.push(ShiftService.delete(shift.id));
    //     }
    //
    //     await Promise.all(promises);
    //
    //     this.$emit("refresh");
    //     this.reset();
    //   } catch (error) {
    //     // TODO: Set error state for component & allow user to reload page
    //     // We usually should end up here, if we are already logging out.
    //     // But a proper error state could mitigate further issues.
    //     log(error);
    //   }
    // },
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
      try {
        const payload = shift.toPayload();
        payload.was_reviewed = true;
        await this.$store.dispatch("contentData/updateShift", {
          payload,
          initialContract: payload.contract
        });
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
