<template>
  <ClockModel :start-date="startDate">
    <template v-slot="{ start, stop, reset, data, pause, unpause, duration }">
      <v-col cols="8">
        <v-row>
          <v-col sm="4">
            <v-hover>
              <v-btn
                slot-scope="{ hover }"
                outlined
                text
                width="150"
                @click="toggle(start, stop, pause, duration)"
              >
                <v-slide-y-transition hide-on-leave>
                  <span v-if="!data.start">Clock in</span>
                </v-slide-y-transition>
                <v-slide-y-transition hide-on-leave>
                  <span
                    v-if="data.start && (!hover || clockInTimeout) && !dialog"
                  >
                    {{ duration | toTime }}
                  </span>
                </v-slide-y-transition>
                <v-slide-y-transition hide-on-leave>
                  <span
                    v-if="(hover && data.start && !clockInTimeout) || dialog"
                  >
                    Clock out
                  </span>
                </v-slide-y-transition>
              </v-btn>
            </v-hover>
          </v-col>

          <portal to="dialog">
            <TheDialog v-if="dialog" :max-width="400">
              <template v-slot:content>
                <v-card>
                  <v-card-title class="headline word-break">
                    This shift looks very short.
                  </v-card-title>
                  <v-card-text>
                    Do you want to save this shift or continue working? We can
                    also forget about it completely.
                  </v-card-text>
                  <v-card-actions>
                    <v-row>
                      <v-col sm="12">
                        <v-btn
                          color="primary"
                          text
                          @click="toggleShortShift(stop)"
                        >
                          Finish and save shift
                        </v-btn>
                      </v-col>
                      <v-col sm="12">
                        <v-btn text @click="toggleShortShift(unpause)">
                          Continue working
                        </v-btn>
                      </v-col>
                      <v-col sm="12">
                        <v-btn
                          color="error"
                          text
                          @click="toggleShortShift(reset)"
                          >Discard shift</v-btn
                        >
                      </v-col>
                    </v-row>
                  </v-card-actions>
                </v-card>
              </template>
            </TheDialog>
          </portal>
        </v-row>
      </v-col>
    </template>
  </ClockModel>
</template>

<script>
import ClockModel from "@/components/ClockModel";
import TheDialog from "@/components/TheDialog";

import { addSeconds, format } from "date-fns";
import { setTimeout } from "timers";

export default {
  components: {
    ClockModel,
    TheDialog
  },
  filters: {
    toTime(seconds) {
      const date = addSeconds(new Date(1970, 1, 1), seconds);
      return format(date, "HH[h]mm[m]ss[s]");
    }
  },
  props: {
    startDate: {
      type: Date,
      default: null
    }
  },
  data() {
    return {
      dialog: false,
      clockInTimeout: false
    };
  },
  methods: {
    buttonClass(hover) {
      return hover ? "primary darken-1" : "primary";
    },
    toggleShortShift(callback) {
      callback();
      this.dialog = false;
    },
    toggle(start, stop, pause, duration) {
      if (duration === null) {
        start(new Date());
        this.clockInTimeout = true;
        setTimeout(() => {
          this.clockInTimeout = false;
        }, 5000);
      } else if (duration < 600) {
        this.dialog = true;
        pause();
      } else {
        stop();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.word-break {
  word-break: break-word;
}
</style>
