<template>
  <ClockInOut :clocked-shift="clockedShift">
    <template
      v-slot="{
        data,
        duration,
        status,
        start,
        stop: pause,
        reset: destroy,
        save
      }"
    >
      <v-window v-model="window">
        <v-window-item :key="0">
          <ClockInOutCardClock
            :actions="{ data, duration, status, start, pause, destroy, save }"
          />
        </v-window-item>
      </v-window>
      <!-- <portal v-if="needsReview" to="dialog">
          <ReviewShifts
            :shift="shiftToReview"
            :callbacks="callbacks"
            @close="closeReview()"
          />
        </portal>

        <portal v-if="reselectContract !== null" to="dialog">
          <TheDialog>
            <template v-slot:content>
              <v-card data-cy="change-contract">
                <v-card-title class="headline word-break">
                  You are clocked into a different contract.
                </v-card-title>
                <v-card-text>
                  You will be redirected to the contract selection screen.
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    data-cy="redirect"
                    color="primary"
                    text
                    @click="reselectContract"
                  >
                    OK
                  </v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </TheDialog>
        </portal>
      </div> -->
    </template>
  </ClockInOut>
</template>

<script>
import ClockInOut from "@/components/ClockInOut";
import ClockInOutCardClock from "@/components/ClockInOutCardClock";
// import ReviewShifts from "@/components/ReviewShifts";
// import TheDialog from "@/components/TheDialog";

import { parseISO } from "date-fns";

// import { mdiDelete, mdiInformation } from "@mdi/js";

export default {
  name: "ClockInOutCard",
  components: {
    ClockInOut,
    ClockInOutCardClock
    // ClockInOut,
    // ReviewShifts,
    // TheDialog
  },
  props: {
    selectedContract: {
      type: Object || null,
      required: true
    },
    clockedShift: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      window: 0,
      icons: {},
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
      if (contract === null) return;

      this.contractDates = {
        start: parseISO(contract.date.start),
        end: parseISO(contract.date.end)
      };
    },
    closeReview() {
      this.needsReview = false;
    }
  }
};
</script>
