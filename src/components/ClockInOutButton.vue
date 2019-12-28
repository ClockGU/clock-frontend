<template>
  <ClockInOut :clocked-shift="clockedShift" @short="short" @overflow="overflow">
    <template v-slot="{ action, duration, status }">
      <div>
        <v-col cols="10">
          <v-row>
            <v-col xs="10">
              <v-hover>
                <v-btn
                  slot-scope="{ hover }"
                  data-cy="clock-in-out-button"
                  outlined
                  text
                  width="150"
                  :disabled="disabled"
                  @click="action"
                >
                  <v-slide-y-transition hide-on-leave>
                    <span v-if="status === 'idle'">
                      Clock in
                    </span>
                  </v-slide-y-transition>
                  <v-slide-y-transition hide-on-leave>
                    <span
                      v-if="
                        (status === 'running' && (!hover || duration <= 5)) ||
                          needsReview
                      "
                    >
                      {{ duration | toTime }}
                    </span>
                  </v-slide-y-transition>
                  <v-slide-y-transition hide-on-leave>
                    <span
                      v-if="
                        (status === 'paused' || (hover && duration > 5)) &&
                          !needsReview
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
            :shift="shiftToReview"
            :callbacks="callbacks"
            @close="closeReview()"
          />
        </portal>
      </div>
    </template>
  </ClockInOut>
</template>

<script>
import ClockInOut from "@/components/ClockInOut";
import ReviewShifts from "@/components/ReviewShifts";

import {
  addSeconds,
  // areIntervalsOverlapping,
  format,
  parseISO
} from "date-fns";

export default {
  components: {
    ClockInOut,
    ReviewShifts
  },
  filters: {
    toTime(seconds) {
      // Initially the value is NaN.
      if (isNaN(seconds)) return "";

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
      needsReview: false,
      callbacks: null,
      shiftToReview: null
    };
  },
  computed: {
    contract() {
      return this.$store.state.selectedContract;
    },
    disabled() {
      // Always return false to make the button never disabled.
      // We should catch all errors now, and disabling is not a priority right now.
      return false;
      // Return false if todays date does not overlap with the contract.
      // return !areIntervalsOverlapping(
      //   { start: this.contractDates.start, end: this.contractDates.end },
      //   { start: new Date(), end: new Date() }
      // );
    }
  },
  watch: {
    selectedContract(newValue) {
      this.setContractDates(newValue);
    }
  },
  methods: {
    short(data, callbacks) {
      this.shiftToReview = { start: data.startDate, contract: this.contract };
      this.needsReview = true;
      this.callbacks = callbacks;
    },
    overflow(data, callbacks) {
      this.shiftToReview = { start: data.startDate, contract: this.contract };
      this.needsReview = true;
      this.callbacks = callbacks;
    },
    setContractDates(contract) {
      this.contractDates = {
        start: parseISO(contract.date.start),
        end: parseISO(contract.date.end)
      };
    },
    buttonClass(hover) {
      return hover ? "primary darken-1" : "primary";
    },
    closeReview() {
      this.needsReview = false;
    }
  }
};
</script>
