<template>
  <v-window v-model="window">
    <v-overlay
      :value="showOverlay"
      absolute
      :opacity="contractValid ? 1.0 : 0.9"
    >
      <v-container>
        <v-row>
          <v-col cols="12">
            <p>
              {{ overlayMessage }}
            </p>
          </v-col>
          <v-col
            v-if="contracts.length > 1 && clockedShift !== undefined"
            cols="12"
          >
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
          data: clockData,
          duration,
          status,
          start,
          destroy: reset
        }"
        :save-fn="save"
        :contract-name="contractName"
      />
    </v-window-item>
    <v-window-item :key="1">
      <ClockInOutCardForm
        :overflow="overflow"
        :shift="shiftToModify"
        :destroy="reset"
        :contract-name="contractName"
        @updateWindow="window += $event"
      ></ClockInOutCardForm>
    </v-window-item>
  </v-window>
</template>

<script>
import ClockInOutMixin from "@/mixins/ClockInOutMixin";
import ClockInOutCardClock from "@/components/ClockInOutCardClock";
import { mapGetters } from "vuex";

import contractValidMixin from "@/mixins/contractValid";
import { Shift } from "@/models/ShiftModel";
import ClockInOutCardForm from "@/components/ClockInOutCardForm";

export default {
  name: "ClockInOutCard",
  components: {
    ClockInOutCardForm,
    ClockInOutCardClock
  },
  mixins: [contractValidMixin, ClockInOutMixin],
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      window: 0,
      shiftToModify: new Shift()
    };
  },
  computed: {
    ...mapGetters({
      contracts: "contentData/allContracts",
      selectedContract: "selectedContract/selectedContract",
      clockedShift: "clock/clockedShift"
    }),
    clockedContract() {
      if (this.clockedShift === undefined) return this.selectedContract;

      return this.$store.getters["contentData/contractById"](
        this.clockedShift.contract
      );
    },
    overlayMessage() {
      if (this.disabled) {
        return this.$t("dashboard.disabled.contractNeededForClocking");
      }
      if (this.contractInFuture)
        return this.$t("dashboard.clock.contractInFuture");
      if (this.contractExpired)
        return this.$t("dashboard.clock.contractExpired");
      else return this.$t("dashboard.clock.contractInactive");
    },
    showOverlay() {
      return this.clockedContract === undefined || !this.contractValid;
    },
    contractName() {
      return this.clockedContract === undefined
        ? this.$tc("models.noSelectedContract", 1)
        : this.clockedContract.name;
    },
    overflow() {
      console.log(this.shiftToModify.started);
      return (
        this.shiftToModify.stopped.getHours() === 23 &&
        this.shiftToModify.stopped.getMinutes() === 59
      );
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
