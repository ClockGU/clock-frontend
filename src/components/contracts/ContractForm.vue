<template>
  <v-form>
    <contract-model :uuid="uuid">
      <template v-slot="{ data, create, update, destroy }">
        <v-card>
          <v-card-text>
            <v-layout>
              <v-flex xs4>
                <contract-form-date-input
                  v-model="data.start"
                  :contract="data"
                  label="Start date"
                  type="start"
                ></contract-form-date-input>
              </v-flex>
              <v-flex xs4 offset-xs2>
                <contract-form-date-input
                  v-model="data.end"
                  :contract="data"
                  label="End date"
                  type="end"
                ></contract-form-date-input>
              </v-flex>
            </v-layout>
            <v-layout align-center>
              <v-flex xs12 md5>
                <v-text-field
                  v-model="data.name"
                  label="Contract name"
                  required
                />
                <v-text-field
                  v-model="data.hours"
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
            <v-btn v-if="uuid" flat @click="destroy(destroy)">Delete</v-btn>
            <v-spacer></v-spacer>
            <v-btn flat @click="submit({ create: create, update: update })">{{
              saveLabel
            }}</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </contract-model>
  </v-form>
</template>

<script>
import ContractFormDateInput from "@/components/contracts/ContractFormDateInput";
import ContractModel from "@/components/contracts/ContractModel";

// import { required, minLength } from "vuelidate/lib/validators";

export default {
  name: "ContractForm",
  components: { ContractModel, ContractFormDateInput },
  data: () => ({
    valid: false
  }),
  props: {
    uuid: {
      type: String,
      default: null
    }
  },
  computed: {
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
    saveLabel() {
      return this.uuid === null ? "Save" : "Update";
    }
  },
  // validations: {
  //   name: { required, maxLength: minLength(2) },
  //   hours: { required }
  // },
  methods: {
    submit(callback) {
      this.uuid === null ? callback.create() : callback.update();

      // this.$router.push({ name: "contractList" });
    },
    destroy(callback) {
      callback();

      this.$router.push({ name: "contractList" });
    }
    // validateHours(data) {
    //   data.hours = "11:11";
    // }
  }
};
</script>
