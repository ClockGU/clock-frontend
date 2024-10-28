<template>
  <v-card :max-height="800">
    <CardToolbar
      :title="title"
      close-action
      @close="$emit('close')"
    ></CardToolbar>
    <v-card-text style="max-height: 800px">
      <v-row class="mb-3" align="center" justify="center">
        <v-btn :disabled="step < 1" variant="text" @click="prev">
          <v-icon>{{ icons.mdiChevronLeft }}</v-icon>
        </v-btn>

        <span>{{ step + 1 }} / {{ lengthAllOverlaps }}</span>

        <v-btn
          :disabled="step === lengthAllOverlaps - 1"
          variant="text"
          @click="next"
        >
          <v-icon>{{ icons.mdiChevronRight }}</v-icon>
        </v-btn>
      </v-row>
      <v-row>
        <v-col class="text-center">
          <span> {{ formatDay(allOverlappingShifts[step][0].started) }}</span>
        </v-col>
      </v-row>
      <div style="max-height: 600px; overflow-y: scroll">
        <v-window v-model="step">
          <v-window-item
            v-for="(overlapShifts, index) in allOverlappingShifts"
            :key="overlapShifts[0].id"
            :value="index"
          >
            <v-table :id="overlapShifts[0].id">
              <template #default>
                <thead>
                  <tr>
                    <th class="text-left">Time</th>
                    <th class="text-center pr-0">
                      <span>{{ $t("models.shift") }} 1</span> <v-spacer />
                      <v-btn
                        variant="flat"
                        :icon="icons.mdiTrashCan"
                        @click="deleteShift(overlapShifts[0])"
                      />
                    </th>
                    <th class="text-center pl-0">
                      <span>{{ $t("models.shift") }} 2</span> <v-spacer />
                      <v-btn
                        variant="flat"
                        :icon="icons.mdiTrashCan"
                        @click="deleteShift(overlapShifts[1])"
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="time in getTimeStamps(...overlapShifts)"
                    :key="time + overlapShifts[0].id"
                    style="overflow: visible"
                  >
                    <td>{{ time }}</td>
                    <td
                      :class="[
                        isWithinTime(overlapShifts[0], time)
                          ? 'shift-one'
                          : 'special-border'
                      ]"
                    >
                      <div
                        class="fixed-height-div"
                        :style="
                          isWithinTime(overlapShifts[0], time)
                            ? {
                                ...backgroundStyle(overlapShifts[0], time),
                                ...shiftOneStyles
                              }
                            : {}
                        "
                      ></div>
                    </td>
                    <td
                      :class="[
                        isWithinTime(overlapShifts[1], time)
                          ? 'shift-two'
                          : 'special-border'
                      ]"
                    >
                      <div
                        class="fixed-height-div"
                        :style="
                          isWithinTime(overlapShifts[1], time)
                            ? {
                                ...backgroundStyle(overlapShifts[1], time),
                                ...shiftTwoStyles
                              }
                            : {}
                        "
                      ></div>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-table>
          </v-window-item>
        </v-window>
      </div>
    </v-card-text>
    <ShiftFormDialog
      :shift="shift"
      :value="editShift"
      disable-activator
      @close="editShift = false"
    ></ShiftFormDialog>
  </v-card>
</template>

<script>
import { SHIFT_TYPE_COLORS } from "@/utils/colors";
import { localizedFormat } from "@/utils/date";
import { getOverlappingShifts } from "@/utils/shift";
import {
  mdiClose,
  mdiChevronLeft,
  mdiChevronRight,
  mdiPencil,
  mdiCancel,
  mdiTrashCan
} from "@mdi/js";

import { mapState, mapGetters } from "vuex";
import ShiftFormDialog from "@/components/forms/dialogs/ShiftFormDialog.vue";
import CardToolbar from "@/components/cards/CardToolbar.vue";
import { differenceInMinutes } from "date-fns";

export default {
  name: "CalendarOverlap",
  components: { CardToolbar, ShiftFormDialog },
  props: {
    month: {
      type: Date,
      required: true
    },
    shifts: {
      type: Array,
      required: true
    }
  },
  emits: ["close"],
  data: () => ({
    icons: {
      mdiClose,
      mdiChevronLeft,
      mdiChevronRight,
      mdiTrashCan
    },
    step: 0,
    showForm: false,
    shiftEntity: null,
    editShift: false,
    shift: undefined,
    shiftOneStyles: {
      marginRight: "4px",
      backgroundColor: "rgb(var(--v-theme-warning))"
    },
    shiftTwoStyles: {
      marginLeft: "4px",
      backgroundColor: "rgb(var(--v-theme-primary))"
    }
  }),
  watch: {
    step() {
      this.$nextTick(() => this.applyLastShiftClasses());
    }
  },
  computed: {
    ...mapGetters({
      contracts: "contentData/allContracts"
    }),
    ...mapState({
      locale: "locale"
    }),
    allOverlappingShifts() {
      return getOverlappingShifts(this.shifts).sort((a, b) => {
        return a[0].started - b[1].started;
      });
    },
    lengthAllOverlaps() {
      return this.allOverlappingShifts.length;
    },
    title() {
      return (
        this.$t("calendar.overlap.resolving") +
        " " +
        localizedFormat(this.month, "MMMM yyyy")
      );
    }
  },
  mounted() {
    this.applyLastShiftClasses();
  },
  methods: {
    applyLastShiftClasses() {
      const tables = document.querySelectorAll("div.v-table[id]");
      const table = tables[tables.length - 1];
      const shiftOneElements = table.querySelectorAll("td.shift-one");

      // Check if there are any elements and apply the style to the last one
      if (shiftOneElements.length > 0) {
        const lastShiftOne = shiftOneElements[shiftOneElements.length - 1];
        lastShiftOne.classList.add("last-shift"); // Add a special class
      }
      const shiftTwoElements = table.querySelectorAll("td.shift-two");

      // Check if there are any elements and apply the style to the last one
      if (shiftTwoElements.length > 0) {
        const lastShiftTwo = shiftTwoElements[shiftTwoElements.length - 1];
        lastShiftTwo.classList.add("last-shift"); // Add a special class
      }
    },
    formatDay(date) {
      return localizedFormat(date, "dd.MM.yyyy");
    },
    handleEventClick(event) {
      this.shift = event.event.shift;
      this.editShift = true;
    },
    prev() {
      this.step -= 1;
    },
    next() {
      this.step += 1;
    },
    getTimeStamps(shiftOne, shiftTwo) {
      const startHour =
        Math.min(shiftOne.started.getHours(), shiftTwo.started.getHours()) - 1;
      const endHour =
        Math.max(shiftOne.stopped.getHours(), shiftTwo.stopped.getHours()) + 1;
      const timeStamps = [];
      for (let i = startHour; i <= endHour; i++) {
        timeStamps.push(`${i}:00`);
      }
      return timeStamps;
    },
    isWithinTime(shift, time) {
      if (shift.wasChecked === undefined) {
        shift.wasChecked = 0;
      }
      const hour = parseInt(time.split(":")[0]);
      const startHour = shift.started.getHours();
      const endHour = shift.stopped.getHours();

      return startHour <= hour && hour <= endHour;
    },
    backgroundStyle(shift, time) {
      const hour = parseInt(time.split(":")[0]);
      const startHour = shift.started.getHours();
      const endHour = shift.stopped.getHours();
      const startMinute = hour === startHour ? shift.started.getMinutes() : 0;
      const endMinute = hour === endHour ? shift.stopped.getMinutes() : 60;
      const height = endMinute - startMinute; // 1px per minute
      const top = startMinute; // 1px per minute
      return { height: `${height}px`, top: `${top}px`, position: "relative" };
    },
    async deleteShift(shift) {
      await this.$store.dispatch("contentData/deleteShift", shift);
    }
  }
};
</script>

<style scoped>
.scroll {
  overflow-y: scroll;
}
.percent-height-50 {
  max-height: 50%;
}

td {
  position: relative; /* Ensures positioning context for the div */
  vertical-align: top; /* Aligns content at the top of the cell */
  overflow: visible;
  border-bottom: none !important;
  height: 60px !important;
  padding-right: 0 !important;
  padding-left: 0 !important;
}
.special-border,
.last-shift {
  border-bottom: thin solid rgba(var(--v-border-color), var(--v-border-opacity)) !important;
}

tr td:first-of-type {
  padding-right: 16px;
  padding-left: 16px;
  width: 80px;
}

.fixed-height-div {
  position: absolute; /* Positions the div at the top left of the td */
  top: 0;
  left: 0;
}
table {
  table-layout: fixed; /* Prevents table resizing based on content */
  width: 100%;
}
</style>
