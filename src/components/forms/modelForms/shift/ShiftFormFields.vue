.vue
<template>
  <v-card-text class="pb-0">
    <ShiftFormDatetimeInput
      v-model:started="shift.started"
      v-model:stopped="shift.stopped"
      :contract-id="shift.contract"
      :errors="timeErrors"
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
              <template #activator="{ props }">
                <a v-bind="props">
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
        <v-list-subheader class="pl-8">
          {{ $t("shifts.types.label") }}
        </v-list-subheader>
        <ShiftFormType v-model="shift.type" />
      </v-col>
      <v-col cols="12">
        <v-divider></v-divider>
      </v-col>
      <v-col cols="12" class="pb-0">
        <ShiftFormSelectContract
          v-model="shift.contract"
          :validation-date="shift.started"
          @update:model-value="setValidDate"
        />
        <ShiftFormReview :value="shift.wasReviewed"></ShiftFormReview>
      </v-col>
    </v-row>
  </v-card-text>
</template>

<script>
import { Shift } from "@/models/ShiftModel";

import ShiftFormRepeat from "@/components/shifts/ShiftFormRepeat.vue";
import ShiftFormNote from "@/components/shifts/ShiftFormNote.vue";
import ShiftFormTags from "@/components/shifts/ShiftFormTags.vue";
import ShiftFormType from "@/components/shifts/ShiftFormType.vue";
import ShiftFormSelectContract from "@/components/shifts/ShiftFormSelectContract.vue";
import { isBefore, isPast, isAfter, startOfDay, isFuture } from "date-fns";
import { mdiRepeat } from "@mdi/js";
import ShiftFormDatetimeInput from "@/components/shifts/ShiftFormDatetimeInput.vue";
import ClockCardAlert from "@/components/ClockCardAlert.vue";
import OmbudsMenu from "@/components/OmbudsMenu.vue";
import ShiftFormReview from "@/components/shifts/ShiftFormReview.vue";
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
    modelValue: {
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
  emits: ["update:modelValue", "scheduleShifts"],
  data() {
    return {
      shift: this.modelValue,
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
    modelValue(value) {
      this.shift = value;
    },
    shift: {
      handler(value) {
        value.wasReviewed = !this.isInFuture;
        this.$emit("update:modelValue", value);
      },
      deep: true
    },
    scheduledShifts(value) {
      this.$emit("scheduleShifts", value);
    },
    showRepeat(value) {
      if (!value) {
        this.resetScheduledShifts();
      }
    }
  },
  created() {
    this.shift.wasReviewed = !this.isInFuture;
  },
  methods: {
    setValidDate() {
      // If a user changes the coontract of a shift we want to
      // set the start date to the first valid date possible in the newly
      // selected contract.
      const contractObj = this.$store.getters["contentData/contractById"](
        this.shift.contract
      );
      let date = this.shift.started;
      if (isBefore(this.shift.started, contractObj.startDate)) {
        date = contractObj.startDate;
        date.setHours(10, 0, 0);
      } else if (isAfter(this.shift.started, contractObj.endDate)) {
        date = contractObj.endDate;
        date.setHours(10, 0, 0);
      }
      this.shift.started = date;
    },
    resetScheduledShifts() {
      this.scheduledShifts = null;
    }
  }
};
</script>

<style scoped>
.link-coloring {
  color: blue;
}
</style>
