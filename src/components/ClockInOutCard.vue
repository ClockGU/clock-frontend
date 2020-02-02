<template>
  <ClockInOut :clocked-shift="clockedShift" @short="short" @overflow="overflow">
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
      <v-card
        :disabled="
          (status === 'running' && duration === 0) || status === 'saving'
        "
        :loading="
          (status === 'running' && duration === 0) || status === 'saving'
        "
      >
        <v-toolbar :elevation="0">
          <v-toolbar-title>
            {{ duration === 0 ? "No running shift" : "Shift is running" }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-scale-transition>
              <v-btn
                v-if="status === 'running' && duration !== 0"
                icon
                @click="destroy"
              >
                <v-icon>{{ icons.mdiDelete }}</v-icon>
              </v-btn>
            </v-scale-transition>
          </v-toolbar-items>
        </v-toolbar>

        <v-card-text>
          <v-row justify="center">
            <span v-if="duration === 0" class="title font-weight-light">
              Start a shift
            </span>
            <span v-else class="title font-weight-light">
              {{ duration | toTime }}
            </span>
          </v-row>
          <v-slide-x-transition>
            <v-btn v-if="duration === 0" color="primary" block @click="start">
              Clock in
            </v-btn>
            <v-btn
              v-if="
                (status === 'running' && duration !== 0) || status === 'saving'
              "
              color="red"
              block
              text
              @click="save"
            >
              Clock out
            </v-btn>
          </v-slide-x-transition>
          <!-- <v-btn @click="pause">Pause</v-btn> -->
        </v-card-text>
      </v-card>
      <!-- <div>
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
// import ReviewShifts from "@/components/ReviewShifts";
// import TheDialog from "@/components/TheDialog";

import {
  addSeconds,
  // areIntervalsOverlapping,
  format,
  parseISO
} from "date-fns";

import { mdiDelete } from "@mdi/js";

export default {
  name: "ClockInOutCard",
  components: {
    ClockInOut
    // ClockInOut,
    // ReviewShifts,
    // TheDialog
  },
  filters: {
    toTime(seconds) {
      let string = "";

      const date = addSeconds(new Date(1970, 1, 1), seconds);
      const days = Math.floor(seconds / (60 * 60 * 24));
      const hours = format(date, "HH");
      const minutes = format(date, "mm");
      const sec = format(date, "ss");

      if (days > 0) {
        string += `${days} days, `;
      }
      if (hours !== "00") {
        string += `${hours} hrs `;
      }
      if (minutes !== "00") {
        string += `${minutes} mins `;
      }
      if (sec !== "00") {
        string += `${sec} secs`;
      }
      return string;
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
      icons: { mdiDelete },
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
