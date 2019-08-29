<template>
  <v-layout justify-center>
    <v-flex xs8 md4>
      <ClockModel :start-date="startDate">
        <template v-slot="{ toggle, data, duration }">
          <v-layout wrap>
            <v-flex xs12>
              <v-select
                v-model="data.contract"
                :items="contracts"
                item-text="name"
                item-value="uuid"
                label="Please select a contract"
              ></v-select>
            </v-flex>
            <v-flex xs12>
              <v-hover>
                <v-btn
                  slot-scope="{ hover }"
                  class="mb-0"
                  :class="
                    hover && !data.start
                      ? 'success'
                      : hover && data.start
                      ? 'warning'
                      : 'primary'
                  "
                  block
                  large
                  depressed
                  @click="toggle()"
                >
                  <span v-if="!hover && !data.start">No shift!</span>
                  <span v-if="hover && !data.start">Clock in!</span>
                  <span v-if="!hover && data.start">Shift running</span>
                  <span v-if="hover && data.start">Clock out!</span>
                </v-btn>
              </v-hover>
            </v-flex>
            <v-expand-transition>
              <v-flex v-if="data.start" xs12>
                <v-btn class="mt-0" depressed disabled large block>{{
                  duration | toTime
                }}</v-btn>
              </v-flex>
            </v-expand-transition>
          </v-layout>
        </template>
      </ClockModel>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState } from "vuex";
import ClockModel from "@/components/ClockModel";

import { addSeconds, format } from "date-fns";

export default {
  name: "ClockInOut",
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
  data: () => ({
    select: null
  }),
  computed: {
    ...mapState({
      contracts: state => state.contract.contracts
    })
  }
};
</script>
