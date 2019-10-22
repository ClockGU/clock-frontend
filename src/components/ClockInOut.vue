<template>
  <ClockModel :start-date="startDate">
    <template v-slot="{ start, stop, reset, data, pause, unpause, duration }">
      <div>
        <v-col cols="10">
          <v-row>
            <v-col xs="10">
              <v-hover>
                <v-btn
                  slot-scope="{ hover }"
                  outlined
                  text
                  width="150"
                  :disabled="disabled"
                  @click="
                    toggle(start, stop, pause, unpause, reset, duration, data)
                  "
                >
                  <v-slide-y-transition hide-on-leave>
                    <span v-if="!data.start">Clock in</span>
                  </v-slide-y-transition>
                  <v-slide-y-transition hide-on-leave>
                    <span
                      v-if="
                        data.start && (!hover || clockInTimeout) && !needsReview
                      "
                    >
                      {{ duration | toTime }}
                    </span>
                  </v-slide-y-transition>
                  <v-slide-y-transition hide-on-leave>
                    <span
                      v-if="
                        (hover && data.start && !clockInTimeout) || needsReview
                      "
                    >
                      Clock out
                    </span>
                  </v-slide-y-transition>
                </v-btn>
              </v-hover>
            </v-col>
          </v-row>
        </v-col>

        <portal v-if="needsReview" to="dialog">
          <ReviewShifts
            :shift="data"
            :callbacks="callbacks"
            @close="
              closeReview({
                actions: {
                  ...$event.actions,
                  unpause: unpause
                }
              })
            "
          />
        </portal>
      </div>
    </template>
  </ClockModel>
</template>

<script>
import ClockModel from "@/components/ClockModel";
import ReviewShifts from "@/components/ReviewShifts";

import {
  addSeconds,
  areIntervalsOverlapping,
  eachDayOfInterval,
  format,
  parseISO
} from "date-fns";
import { setTimeout } from "timers";

export default {
  components: {
    ClockModel,
    ReviewShifts
  },
  filters: {
    toTime(seconds) {
      const date = addSeconds(new Date(1970, 1, 1), seconds);
      return format(date, "HH'h'mm'm'ss's'");
    }
  },
  props: {
    selectedContract: {
      type: Object,
      required: true
    },
    clockedShift: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      clockInTimeout: false,
      startDate: null,
      contractDates: null,
      dialog: false,
      needsReview: false,
      callbacks: null
    };
  },
  computed: {
    disabled() {
      // Return false if todays date does not overlap with the contract.
      return !areIntervalsOverlapping(
        { start: this.contractDates.start, end: this.contractDates.end },
        { start: new Date(), end: new Date() }
      );
    }
  },
  watch: {
    selectedContract(newValue) {
      this.setContractDates(newValue);
    }
  },
  created() {
    this.setContractDates(this.selectedContract);

    if (!this.clockedShift || this.clockedShift.start === null) return;

    this.startDate =
      typeof this.clockedShift.start === "string"
        ? parseISO(this.clockedShift.start)
        : this.clockedShift.start;
  },
  methods: {
    setContractDates(contract) {
      this.contractDates = {
        start: parseISO(contract.date.start),
        end: parseISO(contract.date.end)
      };
    },
    buttonClass(hover) {
      return hover ? "primary darken-1" : "primary";
    },
    closeReview(event) {
      this.needsReview = false;

      console.log(event);
    },
    toggle(start, stop, pause, unpause, reset, duration, data) {
      if (duration === 0) {
        start(new Date(), this.selectedContract.uuid);
        this.clockInTimeout = true;
        setTimeout(() => {
          this.clockInTimeout = false;
        }, 5000);
      } else if (duration < 600) {
        this.dialog = true;

        this.needsReview = true;
        pause();
        this.callbacks = { stop: stop, unpause: unpause, reset: reset };
      } else {
        const days = eachDayOfInterval({ start: data.start, end: new Date() });

        if (days.length > 1) {
          this.needsReview = true;
          return;
        }

        stop();
        this.callbacks = null;
      }
    }
  }
};
</script>
