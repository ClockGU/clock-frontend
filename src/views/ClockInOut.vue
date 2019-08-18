<template>
  <v-layout justify-center>
    <v-flex xs8 md4>
      <clock-model :startDate="startDate">
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
                  class="mb-0"
                  slot-scope="{ hover }"
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
              <v-flex xs12 v-if="data.start">
                <v-btn class="mt-0" depressed disabled large block>{{
                  duration | toTime
                }}</v-btn>
              </v-flex>
            </v-expand-transition>
          </v-layout>
        </template>
      </clock-model>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState } from "vuex";
import ClockModel from "@/components/ClockModel";

import { addSeconds, format } from "date-fns";

export default {
  name: "ClockInOut",
  data: () => ({
    select: null
  }),
  props: {
    startDate: {
      type: Date,
      default: null
    }
  },
  components: {
    ClockModel
  },
  computed: {
    ...mapState({
      contracts: state => state.contract.contracts
    })
  },
  filters: {
    toTime(seconds) {
      const date = addSeconds(new Date(1970, 1, 1), seconds);
      return format(date, "HH[h]mm[m]ss[s]");
    }
  }
};
</script>
