<template>
  <v-form>
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

        <v-card-text
          v-if="!loading"
          :class="{ 'px-0': isMobile, 'py-0': isMobile }"
        >
          <v-stepper v-model="stepper" elevation="0" vertical>
            <v-stepper-step :complete="stepper > 1" step="1">
              Set the start date
              <small
                >Contracts can only start on the 1st or 15th of a month!</small
              >
            </v-stepper-step>

            <v-stepper-content step="1">
              <v-row justify="center" mb-1>
                <v-card class="mb-2" elevation="0">
                  <v-card-text>
                    <v-date-picker
                      v-model="startDate"
                      :landscape="!isMobile"
                      :allowed-dates="allowedStartDates"
                      class="mt-4"
                    ></v-date-picker>
                  </v-card-text>
                </v-card>
              </v-row>
              <v-btn color="primary" @click="nextStep()">Continue</v-btn>
            </v-stepper-content>

            <v-stepper-step :complete="stepper > 2" step="2">
              Set the end date
              <small
                >Contracts can only end on the 14th or last day of a
                month!</small
              >
            </v-stepper-step>

            <v-stepper-content step="2">
              <v-row justify="center" mb-1>
                <v-card class="mb-2" elevation="0">
                  <v-card-text>
                    <v-date-picker
                      v-model="endDate"
                      :landscape="!isMobile"
                      :allowed-dates="allowedEndDates"
                      :min="startDate"
                      class="mt-4"
                    ></v-date-picker>
                  </v-card-text>
                </v-card>
              </v-row>
              <v-btn color="primary" @click="nextStep()">Continue</v-btn>
              <v-btn text @click="previousStep()">Back</v-btn>
            </v-stepper-content>

            <v-stepper-step :complete="stepper > 3" step="3"
              >Set the hours per month</v-stepper-step
            >

            <v-stepper-content step="3">
              <v-card class="mb-2" elevation="0">
                <v-card-text>
                  <v-text-field
                    v-model="contract.hours"
                    label="Working hours"
                    hint="HH:mm"
                    mask="time"
                    return-masked-value
                    persistent-hint
                    required
                  />
                </v-card-text>
              </v-card>
              <v-btn color="primary" @click="nextStep()">Continue</v-btn>
              <v-btn text @click="previousStep()">Back</v-btn>
            </v-stepper-content>

            <v-stepper-step :complete="stepper > 4" step="4"
              >Misc. settings</v-stepper-step
            >

            <v-stepper-content step="4">
              <v-card class="mb-2" elevation="0">
                <v-card-text>
                  <v-text-field
                    v-model="contract.name"
                    label="Contract name"
                    required
                  />
                </v-card-text>
              </v-card>
              <v-btn color="primary" @click="nextStep()">Continue</v-btn>
              <v-btn text @click="previousStep()">Back</v-btn>
            </v-stepper-content>

            <v-stepper-step step="5">Summary</v-stepper-step>
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
              <v-btn v-if="uuid" text @click="destroy()">Delete</v-btn>
              <v-spacer></v-spacer>
              <v-btn text @click="submit(query, contract)">{{
                saveLabel
              }}</v-btn>
              <v-btn text @click="previousStep()">Back</v-btn>
            </v-stepper-content>
          </v-stepper>
        </v-card-text>
      </v-card>
    </FrameApi>
  </v-form>
</template>

<script>
import { format, isLastDayOfMonth, startOfMonth, endOfMonth } from "date-fns";

import { Contract } from "@/models/ContractModel";
import FrameApi from "@/components/FrameApi";
import ContractService from "@/services/contract.service";

export default {
  name: "ContractForm",
  components: { FrameApi },
  filters: {
    formatDate(date) {
      return format(date, "YYYY-MM-DD");
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
    stepper: 1
  }),

  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.name === "xs";
    },
    initialData() {
      return new Contract({
        name: null,
        date: { start: startOfMonth(new Date()), end: endOfMonth(new Date()) },
        hours: null
      });
    },
    startDate: {
      get() {
        return format(this.contract.start, "YYYY-MM-DD");
      },
      set(val) {
        const [year, month, day] = val.split("-");

        const date = new Date(year, month - 1, day, 0, 0);
        this.contract.start = date;
        this.contract.end = endOfMonth(date);
      }
    },
    endDate: {
      get() {
        return format(this.contract.end, "YYYY-MM-DD");
      },
      set(val) {
        const [year, month, day] = val.split("-");
        this.contract.end = new Date(year, month - 1, day, 0, 0);
      }
    },
    // nameErrors() {
    //   const errors = [];

    //   if (!this.$v.name.$dirty) return errors;

    //   !this.$v.name.maxLength &&
    //     errors.push("Name must be at most 5 characters long");

    //   return errors;
    // },
    // hourErrors() {
    //   const errors = [];
    //   console.log(this.$v.hours);

    //   if (!this.$v.hours.$dirty) return errors;
    //   !this.$v.hours.required && errors.push("Hours is required");

    //   return errors;
    // },
    title() {
      return this.uuid === null ? "Add contract" : "Update contract";
    },
    saveLabel() {
      return this.uuid === null ? "Save" : "Update";
    }
  },
  created() {
    this.contract = this.uuid === null ? this.initialData : this.entity;

    this.endpoint = data =>
      this.uuid === null
        ? ContractService.create(data)
        : ContractService.update(data, this.uuid);
  },
  // validations: {
  //   name: { required, maxLength: minLength(2) },
  //   hours: { required }
  // },
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
      return day === 14 || isLastDayOfMonth(val);
    },
    async submit(callback, contract) {
      const payload = contract.toPayload();
      await callback(payload);

      this.redirect();
    },
    redirect() {
      this.$router.push({ name: "contractList" });
    },
    async destroy() {
      if (this.uuid === null) return;

      await ContractService.delete(this.uuid);

      this.redirect();
    }
  }
};
</script>
