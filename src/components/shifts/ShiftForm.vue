<template>
  <FrameApi
    v-slot="{ methods: { query }, status: { error, loading } }"
    :endpoint="endpoint"
  >
    <v-card>
      <v-card-title>
        <h3 class="headline mb-0">{{ title }}</h3>
      </v-card-title>

      <v-fade-transition v-if="loading">
        <v-overlay absolute color="#036358">
          <v-progress-circular indeterminate size="32"></v-progress-circular>
        </v-overlay>
      </v-fade-transition>

      <v-card-text v-if="!loading">
        <v-stepper v-model="stepper" elevation="0" vertical>
          <v-stepper-step :complete="stepper > 1" step="1">
            Contract selection
            <small>
              Choose the contract you want to add the shift to
            </small>
          </v-stepper-step>

          <v-stepper-content step="1">
            <v-select
              v-model="shift.contract"
              :items="contracts"
              item-text="name"
              item-value="uuid"
              label="Please select a contract"
            ></v-select>
            <v-btn
              color="primary"
              :disabled="!shift.contract"
              @click="nextStep()"
              >Continue</v-btn
            >
          </v-stepper-content>

          <v-stepper-step :complete="stepper > 2" step="2">
            Time and date
            <small>
              Choose the date and start/end times of your shift.
            </small>
          </v-stepper-step>

          <v-stepper-content step="2">
            <v-row justify="center">
              <v-card class="mb-2" elevation="0">
                <v-card-text>
                  <v-layout wrap align-center>
                    <v-flex xs12>
                      <ShiftFormDateInput v-model="shift" />
                    </v-flex>
                    <v-flex xs4>
                      <ShiftFormTimeInput
                        v-model="shift"
                        :errors="startTimeErrors"
                        type="start"
                        @update="
                          $v.shift.date.start.$touch() ||
                            $v.shift.date.end.$touch()
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
                          $v.shift.date.end.$touch() ||
                            $v.shift.date.start.$touch()
                        "
                      />
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-row>
            <v-btn
              color="primary"
              :disabled="$v.shift.date.start.$error || $v.shift.date.end.$error"
              @click="nextStep()"
              >Continue</v-btn
            >
            <v-btn text @click="previousStep()">Back</v-btn>
          </v-stepper-content>

          <v-stepper-step :complete="stepper > 3" step="3">
            Set the end date
            <small>
              Contracts can only end on the 14th or last day of a month!
            </small>
          </v-stepper-step>

          <v-stepper-content step="3">
            <v-row justify="center" mb-1>
              <v-card class="mb-2" elevation="0">
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
            <v-btn color="primary" @click="nextStep()">Continue</v-btn>
            <v-btn text @click="previousStep()">Back</v-btn>
          </v-stepper-content>

          <v-stepper-step step="4">Summary</v-stepper-step>
          <v-stepper-content step="4">
            <v-card class="mb-2 grey lighten-3" elevation="0">
              <v-card-text>
                <span
                  >For contract "{{ contract.name }}", type:
                  {{ shift.type.text }}</span
                >
                <h1>
                  Duration: {{ shift.representationalDuration }} ({{
                    shift.date.start | formatTime
                  }}
                  - {{ shift.date.end | formatTime }})
                </h1>
                <p>{{ shift.date.start | formatDate }}</p>
                <p v-if="shift.tags.length > 0">Tags: {{ tags }}</p>
                <p v-if="shift.note">Note: {{ shift.note }}</p>
              </v-card-text>
            </v-card>
            <v-btn v-if="uuid" text @click="destroy()">Delete</v-btn>
            <v-spacer></v-spacer>
            <v-btn text :disabled="!valid" @click="submit(query, shift)">{{
              saveLabel
            }}</v-btn>
            <v-btn text @click="previousStep()">Back</v-btn>
          </v-stepper-content>
        </v-stepper>
      </v-card-text>
    </v-card>
  </FrameApi>
</template>

<script>
import ShiftFormDateInput from "@/components/shifts/ShiftFormDateInput";
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
    ShiftFormDateInput,
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
    stepper: 1
  }),
  computed: {
    ...mapState("contract", {
      contracts: state => state.contracts
    }),
    tags() {
      return this.shift.tags.join(", ");
    },
    contract() {
      if (!this.shift.contract) return { name: "" };

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
