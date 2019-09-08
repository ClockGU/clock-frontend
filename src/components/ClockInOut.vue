<template>
  <ClockModel :start-date="startDate">
    <template v-slot="{ toggle, data, duration }">
      <v-col cols="8">
        <v-row>
          <v-col sm="4">
            <v-hover>
              <v-btn
                slot-scope="{ hover }"
                class="mb-0"
                :class="buttonClass(hover, data)"
                text
                @click="toggle()"
              >
                <span v-if="!hover && !data.start">No shift!</span>
                <span v-if="hover && !data.start">Clock in!</span>
                <span v-if="!hover && data.start">Running</span>
                <span v-if="hover && data.start">Clock out!</span>
              </v-btn>
            </v-hover>
          </v-col>
          <v-slide-x-transition>
            <v-col v-if="data.start" align-self="center" sm="2">
              {{ duration | toTime }}
            </v-col>
          </v-slide-x-transition>
        </v-row>
      </v-col>
    </template>
  </ClockModel>
</template>

<script>
import ClockModel from "@/components/ClockModel";

import { addSeconds, format } from "date-fns";

export default {
  components: {
    ClockModel
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
  methods: {
    buttonClass(hover, data) {
      return {
        success: hover && !data.start,
        warning: hover && data.start,
        primary: !hover
      };
    }
  }
};
</script>
