<template>
  <v-container>
    <v-row>
      <v-col rows="12">
        <h1>
          {{ title }}
        </h1>
      </v-col>
    </v-row>
    <v-form>
      <FrameApi
        v-slot="{ methods: { query }, status: { error, loading } }"
        :endpoint="endpoint"
      >
        <v-row justify="center">
          <v-btn text :disabled="!valid" @click="submit(query, shift)">{{
            saveLabel
          }}</v-btn>

          <v-card class="mb-2">
            <v-card-text>
              <v-layout wrap align-center>
                <v-flex xs12>
                  <ShiftFormDateInlineInput
                    v-model="shift"
                    :min="contract.date.start"
                    :max="contract.date.end"
                  />
                </v-flex>
                <v-flex xs4>
                  <ShiftFormTimeInput
                    v-model="shift"
                    :errors="startTimeErrors"
                    type="start"
                    @update="
                      $v.shift.date.start.$touch() || $v.shift.date.end.$touch()
                    "
                  />
                </v-flex>
                <v-spacer />
                <v-flex xs1>to</v-flex>
                <v-spacer />
                <v-flex xs4>
                  <ShiftFormTimeInput
                    v-model="shift"
                    :errors="endTimeErrors"
                    type="end"
                    @update="
                      $v.shift.date.end.$touch() || $v.shift.date.start.$touch()
                    "
                  />
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>

          <v-card class="mb-2">
            <v-card-text>
              <v-layout wrap align-center>
                <v-flex xs12 md7>
                  <ShiftFormSelect v-model="shift.type" />
                </v-flex>
                <v-flex xs12 md7>
                  <ShiftFormTags v-model="shift.tags" />
                </v-flex>
                <v-flex xs12 md7>
                  <ShiftFormInput v-model="shift.note" />
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-row>
      </FrameApi>
    </v-form>
  </v-container>
</template>

<script>
import ShiftFormDateInlineInput from "@/components/shifts/ShiftFormDateInlineInput";
import ShiftFormTimeInput from "@/components/shifts/ShiftFormTimeInput";
import ShiftFormSelect from "@/components/shifts/ShiftFormSelect";
import ShiftFormInput from "@/components/shifts/ShiftFormInput";
import ShiftFormTags from "@/components/shifts/ShiftFormTags";
import FrameApi from "@/components/FrameApi";

import ShiftService from "@/services/shift.service";

import { Shift } from "@/models/ShiftModel";
import { Contract } from "@/models/ContractModel";

import { mapState } from "vuex";
import { format, isAfter, isBefore } from "date-fns";

import { startEndHours } from "@/utils/time";

import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";

const startBeforeEnd = (value, vm) => isBefore(value, vm.end);
const endAfterStart = (value, vm) => isAfter(value, vm.start);

export default {
  name: "ShiftForm",
  components: {
    FrameApi,
    ShiftFormDateInlineInput,
    ShiftFormTimeInput,
    ShiftFormInput,
    ShiftFormSelect,
    ShiftFormTags
  },
  filters: {
    formatDate(date) {
      return format(date, "YYYY-MM-DD");
    },
    formatTime(date) {
      return format(date, "HH:mm");
    }
  },
  mixins: [validationMixin],
  validations: {
    shift: {
      date: {
        start: { required, startBeforeEnd },
        end: { required, endAfterStart }
      }
    }
  },
  props: {
    uuid: {
      type: String,
      default: null
    },
    entity: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    select: null,
    shift: null,
    stepper: 1,
    stepperText: [
      {
        title: "Time and date",
        subtitle: "Choose the date and start/end times of your shift."
      },
      {
        title: "Set the hours per month",
        subtitle: "Your montly worktime (HH:mm)."
      },
      {
        title: "Summary",
        subtitle: " "
      }
    ]
  }),
  computed: {
    ...mapState("contract", {
      contracts: state => state.contracts
    }),
    currentText() {
      return this.stepperText[this.stepper - 1];
    },
    tags() {
      return this.shift.tags.join(", ");
    },
    contract() {
      if (!this.shift.contract)
        return { name: "", date: { end: "", start: "" } };

      return new Contract(
        this.contracts.find(contract => contract.uuid === this.shift.contract)
      );
    },
    valid() {
      if (
        isAfter(this.shift.date.start, this.shift.date.end) ||
        isBefore(this.shift.date.end, this.shift.date.start)
      )
        return false;

      return true;
    },
    startTimeErrors() {
      const errors = [];
      if (!this.$v.shift.date.start.$dirty) return errors;

      !this.$v.shift.date.start.required &&
        errors.push("You must specify a start time.");

      !this.$v.shift.date.start.startBeforeEnd &&
        errors.push("A shift must start before it ends.");

      return errors;
    },
    endTimeErrors() {
      const errors = [];
      if (!this.$v.shift.date.end.$dirty) return errors;

      !this.$v.shift.date.end.required &&
        errors.push("You must specify a start time.");

      !this.$v.shift.date.end.endAfterStart &&
        errors.push("A shift must end after it starts.");

      return errors;
    },
    initialData() {
      const now = new Date();
      return new Shift({
        date: { ...startEndHours(now) },
        contracts: null,
        type: "st"
      });
    },
    title() {
      return this.uuid === null ? "Add shift" : "Update shift";
    },
    saveLabel() {
      return this.uuid === null ? "Save" : "Update";
    }
  },
  watch: {
    // Make sure to set the date to the first day of the contract,
    // when the user changes the contract.
    "shift.contract": function(newValue, oldValue) {
      if (oldValue === undefined) return;

      const contractStart = this.contract.date.start;
      const contractEnd = this.contract.date.end;
      const now = Date.now();

      // Always set Date.now(), if today is inbetween the
      // start and end date of a contract.
      if (
        isBefore(new Date(contractStart), now) &&
        isAfter(new Date(contractEnd), now)
      ) {
        this.shift.setToday();
        return;
      }

      const [year, month, day] = contractStart.split("-");
      this.shift.setDate(...[year, month - 1, day], "start");
      this.shift.setDate(...[year, month - 1, day], "end");
    }
  },
  created() {
    this.shift = this.uuid === null ? this.initialData : this.entity;

    this.endpoint = data =>
      this.uuid === null
        ? ShiftService.create(data)
        : ShiftService.update(data, this.uuid);
  },
  methods: {
    nextStep() {
      this.stepper += 1;
    },
    previousStep() {
      this.stepper -= 1;
    },
    async submit(callback, shift) {
      const payload = shift.toPayload();
      await callback(payload);

      this.redirect();
    },
    redirect() {
      this.$router.push({ name: "c" });
    },
    async destroy() {
      if (this.uuid === null) return;

      await ShiftService.delete(this.uuid);

      this.redirect();
    }
  }
};
</script>
