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
        <v-overlay :value="showOverlay" absolute opacity="0.9">
          <v-container>
            <v-row>
              <v-col cols="12">
                <p>
                  {{ overlayMessage }}
                </p>
              </v-col>
              <v-col v-if="contracts.length > 1 && clockedShift" cols="12">
                <v-btn color="primary lighten-1" @click="changeContract">
                  {{ $t("actions.switch") }}
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
            @refresh="$emit('refresh')"
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

import contractValidMixin from "@/mixins/contractValid";
import { isSameDay, isSunday, parseISO } from "date-fns";
import { dateIsHoliday } from "@/utils/date";

export default {
  name: "ClockInOutCard",
  components: {
    ClockInOut,
    ClockInOutCardClock,
    ClockInOutCardForm
  },
  mixins: [contractValidMixin],
  props: {
    selectedContract: {
      required: true,
      validator: (prop) => typeof prop === "object" || prop === null
    },
    clockedShift: {
      type: Object,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
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
    overlayMessage() {
      const today = new Date();
      if (this.disabled) {
        return this.$t("dashboard.disabled.contractNeededForClocking");
      }
      if (dateIsHoliday(today)) {
        return this.$t("dashboard.clock.problems.clockIn.bankHoliday");
      }
      if (isSunday(today)) {
        return this.$t("dashboard.clock.problems.clockIn.dateIsSunday");
      }
      if (this.sickOrVacationExists(today)) {
        return this.$t("dashboard.clock.problems.clockIn.sickOrVacationExist");
      }
      if (this.contractInFuture)
        return this.$t("dashboard.clock.contractInFuture");
      if (this.contractExpired)
        return this.$t("dashboard.clock.contractExpired");
      if (this.$route.params.contract !== this.clockedContract.uuid) {
        return this.$t("dashboard.clock.contractInactive");
      }
      return undefined;
    },
    showOverlay() {
      return this.overlayMessage !== undefined;
    }
  },
  methods: {
    changeContract() {
      this.$router.push({
        ...this.$route,
        params: { ...this.$route.params, contract: this.clockedContract.uuid }
      });
    },
    sickOrVacationExists(date) {
      return (
        this.$store.getters["shift/shifts"].filter((shift) => {
          return (
            isSameDay(parseISO(shift.date.start), date) &&
            (shift.type === "vn" || shift.type === "sk")
          );
        }).length > 0
      );
    }
  }
};
</script>
