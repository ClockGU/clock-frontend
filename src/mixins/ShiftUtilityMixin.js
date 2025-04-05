import { isWithinInterval, isBefore, getHours, isFuture, max } from "date-fns";
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
import { SHIFT_TYPE_ICONS } from "@/utils/misc";
import { SHIFT_TYPE_COLORS } from "@/utils/colors";
import { localizedFormat } from "@/utils/date";
import { minutesToHHMM } from "@/utils/time";
import { log } from "@/utils/log";

export default {
  data() {
    return {
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
      typeIcons: SHIFT_TYPE_ICONS,
      colors: SHIFT_TYPE_COLORS
    };
  },
  computed: {
    headers() {
      return [
        {
          title: this.$t("time.date"),
          align: "start",
          sortable: true,
          key: "date"
        },
        {
          title: this.$t("time.start"),
          align: "start",
          sortable: true,
          key: "start"
        },
        {
          title: this.$t("time.duration"),
          align: "start",
          sortable: true,
          key: "duration"
        },
        {
          title: this.$t("calendar.type"),
          align: "start",
          sortable: true,
          key: "type"
        },
        {
          title: this.$t("time.reviewed"),
          align: "start",
          sortable: true,
          key: "reviewed"
        },
        {
          title: "Tags",
          align: "start",
          sortable: true,
          key: "tags"
        },
        {
          title: "Notes",
          align: "start",
          sortable: true,
          key: "note"
        },
        {
          align: "start",
          sortable: false,
          key: "actions"
        }
      ];
    },

    startsInFuture() {
      return isFuture(this.shift.started);
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
    noteDisplay(note, maxlength) {
      if (note.length > maxlength) {
        return note.substr(0, maxlength) + "...";
      } else return note;
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
    }
  }
};
