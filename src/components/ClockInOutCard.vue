<template>
  <ClockInOut :selected-contract="selectedContract">
    <template
      #default="{
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
        <v-overlay
          :value="showOverlay"
          absolute
          :opacity="contractExpired ? 1.0 : 0.9"
          >
          <v-container>
            <v-row>
              <v-col cols="12">
                <p>
                  {{ contractExpired ? $t("dashboard.clock.contractExpired") : $t("dashboard.clock.contractInactive") }}
                </p>
              </v-col>
              <v-col v-if="contracts.length > 1 && clockedShift" cols="12">
                <v-btn 
                  color="primary lighten-1"
                  @click="changeContract"
                >
                  {{ $t("actions.change") }}
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-overlay>
        <v-window-item :key="0">
          <ClockInOutCardClock
            :actions="{
              data,
              clockedContract,
              duration,
              status,
              start,
              pause,
              destroy,
              save
            }"
            @updateWindow="window += $event"
          />
        </v-window-item>

        <v-window-item v-if="clockedShift !== null" :key="1">
          <ClockInOutCardForm
            :clocked-shift="clockedShift"
            :destroy="destroy"
            @updateWindow="window += $event"
          />
        </v-window-item>
      </v-window>
    </template>
  </ClockInOut>
</template>

<script>
import ClockInOut from "@/components/ClockInOut";
import ClockInOutCardClock from "@/components/ClockInOutCardClock";
import ClockInOutCardForm from "@/components/ClockInOutCardForm";

import { mapGetters } from "vuex";

import contractExpiredMixin from "@/mixins/contractExpired";

export default {
  name: "ClockInOutCard",
  components: {
    ClockInOut,
    ClockInOutCardClock,
    ClockInOutCardForm
  },
  mixins: [contractExpiredMixin],
  props: {
    selectedContract: {
      required: true,
      validator: (prop) => typeof prop === "object" || prop === null
    },
    clockedShift: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      window: 0
    };
  },
  computed: {
    ...mapGetters({
      contracts: "contract/contracts"
    }),
    clockedContract() {
      if (this.clockedShift === null) return this.selectedContract;

      return this.contracts.find(
        (contract) => contract.uuid === this.clockedShift.contract
      );
    },
    showOverlay() {
      return (this.$route.params.contract !== this.clockedContract.uuid) || this.contractExpired
    }
  },
  methods: {
    changeContract() {
      this.$router.push({
        ...this.$route,
        params: { ...this.$route.params, contract: this.clockedContract.uuid }
      });
    }
  }
};
</script>
