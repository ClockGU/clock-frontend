<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>
          {{ title }}
        </h1>
      </v-col>
    </v-row>
    <v-form>
      <FrameApi
        v-slot="{ methods: { query }, status: { error, loading } }"
        :endpoint="endpoint"
        @success="redirect"
      >
        <v-stepper v-if="!loading" v-model="stepper">
          <v-stepper-header>
            <v-row align="center">
              <v-col cols="5">
                <v-progress-circular
                  color="primary lighten-2"
                  class="ml-2"
                  :value="(stepper / 5) * 100"
                ></v-progress-circular>
                <span class="pl-2">Step {{ stepper }} / 5</span>
              </v-col>
              <v-col>
                <p class="mb-0">
                  {{ currentText.title }}
                </p>
                <small>
                  {{ currentText.subtitle }}
                </small>
              </v-col>
            </v-row>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content step="1">
              <v-banner v-if="disableDateChange">
                You cannot change the start/end date, after adding shifts to the
                contract.
              </v-banner>

              <v-row justify="center" mb-1>
                <v-card elevation="0">
                  <v-card-text>
                    <v-date-picker
                      v-model="startDate"
                      :landscape="!isMobile"
                      :allowed-dates="allowedStartDates"
                      :disabled="disableDateChange"
                      class="mt-4"
                    ></v-date-picker>
                  </v-card-text>
                </v-card>
              </v-row>
              <v-btn color="primary" text @click="nextStep()">Continue</v-btn>
            </v-stepper-content>

            <v-stepper-content step="2">
              <v-banner v-if="disableDateChange">
                You cannot change the start/end date, after adding shifts to the
                contract.
              </v-banner>

              <v-row justify="center" mb-1>
                <v-card class="mb-2" elevation="0">
                  <v-card-text>
                    <v-date-picker
                      v-model="endDate"
                      :landscape="!isMobile"
                      :allowed-dates="allowedEndDates"
                      :min="startDate"
                      :disabled="disableDateChange"
                      class="mt-4"
                    ></v-date-picker>
                  </v-card-text>
                </v-card>
              </v-row>
              <v-btn color="primary" text @click="nextStep()">Continue</v-btn>
              <v-btn text @click="previousStep()">Back</v-btn>
            </v-stepper-content>

            <v-stepper-content step="3">
              <v-card class="mb-2" elevation="0">
                <v-card-text>
                  <v-text-field
                    v-model="contract.hours"
                    v-mask="'##:##'"
                    label="Working hours"
                    hint="HH:mm"
                    mask="time"
                    return-masked-value
                    persistent-hint
                    required
                    :error-messages="hoursErrors"
                    @blur="$v.contract.hours.$touch()"
                  />
                </v-card-text>
              </v-card>
              <v-btn
                color="primary"
                text
                :disabled="$v.contract.hours.$error || !contract.hours"
                @click="nextStep()"
                >Continue</v-btn
              >
              <v-btn text @click="previousStep()">Back</v-btn>
            </v-stepper-content>

            <v-stepper-content step="4">
              <v-card class="mb-2" elevation="0">
                <v-card-text>
                  <v-text-field
                    v-model="contract.name"
                    label="Contract name"
                    :error-messages="nameErrors"
                    counter="100"
                    required
                    @blur="$v.contract.name.$touch()"
                  />
                </v-card-text>
              </v-card>
              <v-btn
                color="primary"
                text
                :disabled="$v.contract.name.$error || !contract.name"
                @click="nextStep()"
                >Continue</v-btn
              >
              <v-btn text @click="previousStep()">Back</v-btn>
            </v-stepper-content>

            <v-stepper-content step="5">
              <v-card class="mb-2 grey lighten-3" elevation="0">
                <v-card-text>
                  <span>{{ contract.name }}</span>
                  <h1>{{ contract.hours }}</h1>
                  <p>
                    {{ contract.start | formatDate }} -
                    {{ contract.end | formatDate }}
                  </p>
                </v-card-text>
              </v-card>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="submit(query, contract)">{{
                saveLabel
              }}</v-btn>
              <v-btn text @click="previousStep()">Back</v-btn>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </FrameApi>
    </v-form>
  </v-container>
</template>

<script>
import {
  format,
  isLastDayOfMonth,
  startOfMonth,
  endOfMonth,
  isAfter,
  parseISO
} from "date-fns";

import { validationMixin } from "vuelidate";
import { required, maxLength, minLength } from "vuelidate/lib/validators";

import { Contract } from "@/models/ContractModel";
import FrameApi from "@/components/FrameApi";
import ContractService from "@/services/contract.service";

const hoursNotZero = value => value !== "00:00";
const validMinutes = value => value.split(":")[1] <= parseInt(59);

export default {
  name: "ContractForm",
  components: { FrameApi },
  filters: {
    formatDate(date) {
      return format(parseISO(date), "yyyy-MM-dd");
    }
  },
  mixins: [validationMixin],
  validations: {
    contract: {
      name: { required, maxLength: maxLength(100), minLength: minLength(2) },
      hours: { required, hoursNotZero, validMinutes, minLength: minLength(5) }
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
    contract: null,
    valid: false,
    stepper: 1,
    stepperText: [
      {
        title: "Set the start date",
        subtitle: "Can start on the 1st or 15th!"
      },
      {
        title: "Set the end date",
        subtitle: "Can end on the 14th or last day!"
      },
      {
        title: "Set the hours per month",
        subtitle: "Your montly worktime (HH:mm)."
      },
      {
        title: "Name your contract",
        subtitle: "Give your contract a name."
      },
      {
        title: "Summary",
        subtitle: " "
      }
    ]
  }),

  computed: {
    disableDateChange() {
      return (
        this.$store.state.shift.shifts.filter(
          shift => shift.contract === this.contract.uuid
        ).length > 0
      );
    },
    currentText() {
      return this.stepperText[this.stepper - 1];
    },
    isMobile() {
      return this.$vuetify.breakpoint.name === "xs";
    },
    initialData() {
      return new Contract({
        name: null,
        date: {
          start: format(startOfMonth(new Date()), "yyyy-MM-dd"),
          end: format(endOfMonth(new Date()), "yyyy-MM-dd")
        },
        hours: null
      });
    },
    title() {
      return this.uuid === null ? "Add contract" : "Update contract";
    },
    saveLabel() {
      return this.uuid === null ? "Save" : "Update";
    },
    startDate: {
      get() {
        return format(parseISO(this.contract.start), "yyyy-MM-dd");
      },
      set(val) {
        const [year, month, day] = val.split("-");

        const date = new Date(year, month - 1, day, 0, 0);
        this.contract.start = date;

        if (isAfter(date, this.contract.end)) {
          this.contract.end = endOfMonth(date);
        }
      }
    },
    endDate: {
      get() {
        return format(parseISO(this.contract.end), "yyyy-MM-dd");
      },
      set(val) {
        const [year, month, day] = val.split("-");
        this.contract.end = new Date(year, month - 1, day, 0, 0);
      }
    },
    nameErrors() {
      const errors = [];
      if (!this.$v.contract.name.$dirty) return errors;
      !this.$v.contract.name.minLength &&
        errors.push("Name must be at least 2 characters long!");
      !this.$v.contract.name.maxLength &&
        errors.push("Name cannot be longer than 100 characters!");

      !this.$v.contract.name.required && errors.push("Name is required");
      return errors;
    },
    hoursErrors() {
      const errors = [];
      if (!this.$v.contract.hours.$dirty) return errors;
      !this.$v.contract.hours.required && errors.push("Hours is required");
      !this.$v.contract.hours.validMinutes &&
        errors.push("Please enter a valid format (HH:MM).");
      !this.$v.contract.hours.minLength &&
        errors.push("Please enter a valid format (HH:MM).");
      !this.$v.contract.hours.hoursNotZero &&
        errors.push("A contract must have a duration.");

      return errors;
    }
  },
  created() {
    this.contract = this.uuid === null ? this.initialData : this.entity;

    this.endpoint = data =>
      this.uuid === null
        ? ContractService.create(data)
        : ContractService.update(data, this.uuid);
  },
  methods: {
    nextStep() {
      this.stepper += 1;
    },
    previousStep() {
      this.stepper -= 1;
    },
    allowedStartDates(val) {
      const day = parseInt(val.split("-")[2], 10);
      return day === 1 || day === 15;
    },
    allowedEndDates(val) {
      const day = parseInt(val.split("-")[2], 10);
      return day === 14 || isLastDayOfMonth(parseISO(val));
    },
    async submit(callback, contract) {
      const payload = contract.toPayload();
      callback(payload);
    },
    redirect({ data }) {
      let routerParam = { name: "contractList" };

      // We need to go back to the selection screen
      if (this.$store.state.selectedContract === null) {
        routerParam = { name: "contractSelect" };
      }

      return new Promise((resolve, reject) => {
        data
          .then(() => {
            this.$router.push(routerParam);

            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    async destroy() {
      if (this.uuid === null) return;

      await ContractService.delete(this.uuid);

      this.redirect();
    }
  }
};
</script>
