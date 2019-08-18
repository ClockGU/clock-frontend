<template>
  <v-form>
    <DataModel
      :id="uuid"
      :entity="initialData"
      endpoint="api/contracts"
      @success="redirect"
    >
      <template
        v-slot="{
          data: contract,
          create,
          update,
          destroy,
          loading
        }"
      >
        <v-card>
          <v-card-title>
            <h3 class="headline mb-0">{{ title }}</h3>
          </v-card-title>

          <v-fade-transition v-if="loading">
            <v-overlay absolute color="#036358">
              <v-progress-circular
                indeterminate
                size="32"
              ></v-progress-circular>
            </v-overlay>
          </v-fade-transition>

          <v-card-text v-if="!loading">
            <v-layout>
              <v-flex xs4>
                <ContractFormDateInput
                  v-model="contract.start"
                  :contract="contract"
                  label="Start date"
                  type="start"
                ></ContractFormDateInput>
              </v-flex>
              <v-flex xs4 offset-xs2>
                <ContractFormDateInput
                  v-model="contract.end"
                  :contract="contract"
                  label="End date"
                  type="end"
                ></ContractFormDateInput>
              </v-flex>
            </v-layout>
            <v-layout align-center>
              <v-flex xs12 md5>
                <v-text-field
                  v-model="contract.name"
                  label="Contract name"
                  required
                />
                <v-text-field
                  v-model="contract.hours"
                  label="Working hours"
                  hint="HH:mm"
                  mask="time"
                  return-masked-value
                  persistent-hint
                  required
                />
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-btn v-if="uuid" text @click="remove(destroy)">Delete</v-btn>
            <v-spacer></v-spacer>
            <v-btn
              text
              @click="submit({ create: create, update: update }, contract)"
              >{{ saveLabel }}</v-btn
            >
          </v-card-actions>
        </v-card>
      </template>
    </DataModel>
  </v-form>
</template>

<script>
import ContractFormDateInput from "@/components/contracts/ContractFormDateInput";
// import ContractModel from "@/components/contracts/ContractModel";
import DataModel from "@/components/DataModel";

import { Contract } from "@/models/Contracts";

// import { required, minLength } from "vuelidate/lib/validators";

export default {
  name: "ContractForm",
  components: { DataModel, ContractFormDateInput },
  props: {
    uuid: {
      type: String,
      default: null
    }
  },
  data: () => ({
    valid: false
  }),
  computed: {
    initialData() {
      return this.uuid
        ? null
        : new Contract({
            // uuid: this.data.id,
            name: null,
            date: { start: new Date(), end: new Date() },
            hours: null
          });
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
  // validations: {
  //   name: { required, maxLength: minLength(2) },
  //   hours: { required }
  // },
  methods: {
    submit(callback, contract) {
      const payload = contract.toPayload();
      this.uuid === null ? callback.create(payload) : callback.update(payload);
    },
    redirect() {
      this.$router.push({ name: "contractList" });
    },
    remove(callback) {
      callback();
    }
    // validateHours(data) {
    //   data.hours = "11:11";
    // }
  }
};
</script>
