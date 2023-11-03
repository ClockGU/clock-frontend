<template>
  <v-card-text class="pb-0">
    <ShiftFormDatetimeInput
      :started="shift.started"
      :stopped="shift.stopped"
      :contract-id="shift.contract"
      :errors="timeErrors"
      @input="setTime"
    />
    <v-row align="center" justify="start">
      <v-col cols="12" class="ma-0">
        <v-expand-transition hide-on-leave>
          <ClockCardAlert
            v-if="alertMessages.length > 0"
            class="mt-2"
            :messages="alertMessages"
            :type="alertType"
          ></ClockCardAlert>
        </v-expand-transition>
        <v-expand-transition hide-on-leave>
          <div v-if="alertMessages.length > 0" class="mt-2">
            {{ $t("shifts.hints.faqText") }}
            <br />
            <router-link to="/faq">{{
              $t("shifts.hints.faqLinkText")
            }}</router-link>
          </div>
        </v-expand-transition>
        <v-expand-transition hide-on-leave>
          <div v-if="alertMessages.length > 0" class="mt-2">
            {{ $t("shifts.hints.ombudsText") }}
            <OmbudsMenu
              disable-activator
              :bottom-position="false"
              offset-y
              bottom
            >
              <template #activator="{ on, attrs }">
                <a v-bind="attrs" v-on="on">
                  {{ $t("shifts.hints.ombudsLinkText") }}
                </a>
              </template>
            </OmbudsMenu>
          </div>
        </v-expand-transition>
      </v-col>
      <v-col cols="12">
        <v-checkbox
          v-model="showRepeat"
          :label="$t('shifts.repeating.checkboxLabel')"
          :prepend-icon="icons.mdiRepeat"
          :disabled="!isInFuture"
          :messages="$t('shifts.repeating.checkboxText')"
          class="ma-0"
        ></v-checkbox>

        <v-expand-transition hide-on-leave>
          <ShiftFormRepeat
            v-if="showRepeat"
            v-model="scheduledShifts"
            :shift="shift"
          />
        </v-expand-transition>
        <v-divider class="mt-4" />
      </v-col>
      <v-col cols="12">
        <ShiftFormTags v-model="shift.tags" />
        <ShiftFormNote v-model="shift.note" />
        <v-subheader class="pl-8">
          {{ $t("shifts.types.label") }}
        </v-subheader>
        <ShiftFormType v-model="shift.type" />
      </v-col>
      <v-col cols="12">
        <v-divider></v-divider>
      </v-col>
      <v-col cols="12" class="pb-0">
        <ShiftFormSelectContract
          v-model="shift.contract"
          :validation-date="shift.started"
          @input="setValidDate"
        />
        <ShiftFormReview :value="shift.wasReviewed"></ShiftFormReview>
      </v-col>
    </v-row>
  </v-card-text>
</template>

<script>
import { Shift } from "@/models/ShiftModel";
import ShiftFormRepeat from "@/components/shifts/ShiftFormRepeat";
import ShiftFormNote from "@/components/shifts/ShiftFormNote";
import ShiftFormTags from "@/components/shifts/ShiftFormTags";
import ShiftFormType from "@/components/shifts/ShiftFormType";
import ShiftFormSelectContract from "@/components/shifts/ShiftFormSelectContract";
import { isAfter, isBefore, isFuture } from "date-fns";
import { mdiRepeat } from "@mdi/js";
import ShiftFormDatetimeInput from "@/components/shifts/ShiftFormDatetimeInput";
import ClockCardAlert from "@/components/ClockCardAlert";
import OmbudsMenu from "@/components/OmbudsMenu.vue";
import ShiftFormReview from "@/components/shifts/ShiftFormReview";
import { ifElse } from "ramda";

export default {
  name: "ShiftFormFields",
  components: {
    ShiftFormReview,
    ShiftFormDatetimeInput,
    ShiftFormTags,
    ShiftFormNote,
    ShiftFormType,
    ShiftFormSelectContract,
    ShiftFormRepeat,
    ClockCardAlert,
    OmbudsMenu
  },
  props: {
    value: {
      type: Shift,
      required: true
    },
    timeErrors: {
      type: Array,
      default: () => []
    },
    alertMessages: {
      type: Array,
      default: () => []
    },
    alertType: {
      type: String,
      default: "alert"
    }
  },
  data() {
    return {
      shift: this.value,
      showRepeat: false,
      icons: {
        mdiRepeat
      },
      scheduledShifts: null
    };
  },
  computed: {
    reviewMessage() {
      if (this.isRunningShift) {
        return this.$t("shifts.reviewErrorLive");
      } else if (!this.shift.wasReviewed && !this.showRepeat) {
        return !this.startsInFuture
          ? this.$t("shifts.reviewErrorPast")
          : this.$t("shifts.reviewErrorFuture");
      } else {
        return "";
      }
    },
    isInFuture() {
      return isFuture(this.shift.stopped);
    }
  },
  watch: {
    value(value) {
      this.shift = value;
    },
    shift(value) {
      this.$emit("input", value);
    },
    scheduledShifts(value) {
      this.$emit("scheduleShifts", value);
    }
  },
  created() {
    this.setWasReviewed();
  },
  methods: {
    setTime(event) {
      this.shift.started = event.started;
      this.shift.stopped = event.stopped;
      this.setWasReviewed();
    },
    setWasReviewed() {
      // All shifts which have stopped before now are counted as reviewed true
      // We set that automatically
      this.shift.wasReviewed = !this.isInFuture;
    },
    setValidDate() {
      // If a user changes the coontract of a shift we want to
      // set the start date to the first valid date possible in the newly
      // selected contract.
      const contractObj = this.$store.getters["contentData/contractById"](
        this.shift.contract
      );
      let date = this.shift.started;
      if (
        isBefore(this.shift.started, contractObj.startDate) ||
        isAfter(this.shift.started, contractObj.endDate)
      ) {
        date = contractObj.startDate;
        date.setHours(10, 0, 0);
      } else if (
        isBefore(contractObj.startDate, new Date()) ||
        isAfter(contractObj.endDate, new Date())
      ) {
        date = new Date();
        date.setHours(10, 0, 0);
      }
      this.shift.started = date;
    }
  }
};
</script>

<style scoped>
.link-coloring {
  color: blue;
}
</style>
