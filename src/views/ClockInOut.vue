<template>
  <v-layout>
    <v-flex xs12 md4>
      <clock-model>
        <template v-slot="{ toggle, data }">
          <v-layout row wrap>
            <v-flex xs12>
              <v-hover>
                <v-btn
                  class="mb-0"
                  slot-scope="{ hover }"
                  :class="
                    hover && !data.started
                      ? 'success'
                      : hover && data.started
                      ? 'warning'
                      : 'primary'
                  "
                  block
                  large
                  depressed
                  text
                  @click="toggle()"
                >
                  <span v-if="!hover && !data.started">No shift!</span>
                  <span v-if="hover && !data.started">Clock in!</span>
                  <span v-if="!hover && data.started">Shift running</span>
                  <span v-if="hover && data.started">Clock out!</span>
                </v-btn>
              </v-hover>
            </v-flex>
            <v-expand-transition>
              <v-flex xs12 v-if="data.started">
                <v-btn class="mt-0" depressed disabled large text block>
                  {{ data.duration | toTime }}
                </v-btn>
              </v-flex>
            </v-expand-transition>
          </v-layout>
        </template>
      </clock-model>
    </v-flex>
  </v-layout>
</template>

<script>
import ClockModel from "@/components/ClockModel";

import { addSeconds, format } from "date-fns";

export default {
  name: "ClockView",
  components: {
    ClockModel
  },
  filters: {
    toTime(seconds) {
      const date = addSeconds(new Date(1970, 1, 1), seconds);
      return format(date, "HH[h]mm[m]ss[s]");
    }
  }
};
</script>
