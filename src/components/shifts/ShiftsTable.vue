<template>
  <div>
    <slot name="head" :destroy-fn="destroy" :selected="selected"></slot>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="shifts"
      :search="search"
      :loading="loading"
      item-key="uuid"
      :custom-sort="sortByDate"
      must-sort
      show-select
    >
      <!-- eslint-disable-next-line -->
      <template #item.date="{ item }">
        {{ formattedDate(item.shift.date.start) }}
      </template>

      <!-- eslint-disable-next-line -->
      <template #item.start="{ item }">
        {{ formattedTime(item.shift.date.start) }}
      </template>

      <!-- eslint-disable-next-line -->
      <template #item.end="{ item }">
        {{ formattedTime(item.shift.date.end) }}
      </template>

      <!-- eslint-disable-next-line -->
      <template #item.duration="{ item }">
        {{ formattedDuration(item.shift.duration) }}
      </template>

      <!-- eslint-disable-next-line -->
      <template #item.type="{ item }">
        <v-chip outlined small :color="colors[item.shift.type.value]">
          <v-icon v-if="isRunningShift(item.shift)" left dense color="red">{{
            icons.mdiCircleMedium
          }}</v-icon>
          {{
            liveString(item.shift) + $t(`shifts.types.${item.shift.type.value}`)
          }}
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

      <!-- eslint-disable-next-line-->
      <template v-slot:item.actions="{ item }">
        <v-btn text @click="$emit('edit', item.shift)">
          <v-icon>
            {{ icons.mdiPencil }}
          </v-icon>
        </v-btn>
        <ShiftAssignContractDialog :shifts="[item]" @reset="$emit('refresh')">
          <template #activator="{ on }">
            <v-btn icon v-on="on">
              <v-icon>{{ icons.mdiSwapHorizontal }}</v-icon>
            </v-btn>
          </template>
        </ShiftAssignContractDialog>

        <ConfirmationDialog @confirm="destroySingleShift(item)">
          <template #activator="{ on }">
            <v-scale-transition>
              <v-btn text v-on="on">
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
        </ConfirmationDialog>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import ConfirmationDialog from "@/components/ConfirmationDialog";
import ShiftAssignContractDialog from "@/components/shifts/ShiftAssignContractDialog";

import { isWithinInterval, isBefore, getHours } from "date-fns";

import {
  mdiCheck,
  mdiClose,
  mdiDelete,
  mdiPencil,
  mdiSwapHorizontal,
  mdiCircleMedium
} from "@mdi/js";

import { SHIFT_TABLE_HEADERS } from "@/utils/misc";

import ShiftService from "@/services/shift";
import { log } from "@/utils/log";
import { SHIFT_TYPE_COLORS } from "@/utils/colors";
import { localizedFormat } from "@/utils/date";
import { minutesToHHMM } from "@/utils/time";

export default {
  name: "ShiftsTable",
  components: {
    ConfirmationDialog,
    ShiftAssignContractDialog
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
      mdiDelete,
      mdiPencil,
      mdiSwapHorizontal,
      mdiCircleMedium
    },
    headers: SHIFT_TABLE_HEADERS,
    colors: SHIFT_TYPE_COLORS,
    selected: []
  }),
  methods: {
    isRunningShift(shift) {
      return isWithinInterval(new Date(), {
        start: shift.date.start,
        end: shift.date.end
      });
    },
    liveString(shift) {
      return this.isRunningShift(shift) && shift.type.value === "st"
        ? this.$t("shifts.running") + " "
        : "";
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
      const desc = sortDesc[0] ? 1 : -1;
      items.sort((a, b) => {
        switch (sortBy[0]) {
          case "date":
            return isBefore(b.date, a.date) ? -desc : desc;
          case "start":
            return isBefore(getHours(b.start), getHours(a.start))
              ? -desc
              : desc;
          case "end":
            return isBefore(getHours(b.end), getHours(a.end)) ? -desc : desc;
          default:
            return a[sortBy[0]] > b[sortBy[0]] ? -desc : desc;
        }
      });
      return items;
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
