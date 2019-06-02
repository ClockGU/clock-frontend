<template>
  <v-form>
    <contract-model :uuid="uuid">
      <template v-slot="{ data, create, update, destroy }">
        <v-card>
          <v-card-text>
            <v-layout row wrap align-center>
              <v-flex xs12 md5>
                <v-text-field
                  v-model="data.name"
                  :error-messages="nameErrors"
                  :counter="5"
                  label="Contract name"
                  required
                  @input="$v.name.$touch()"
                  @blur="$v.name.$touch()"
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
            <v-btn flat @click="destroy(destroy)">Delete</v-btn>
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
import ContractModel from "@/components/contracts/ContractModel";

import { required, maxLength } from "vuelidate/lib/validators";

export default {
  name: "ContractForm",
  components: { ContractModel },
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
    nameErrors() {
      const errors = [];

      if (!this.$v.name.$dirty) return errors;

      !this.$v.name.maxLength &&
        errors.push("Name must be at most 5 characters long");

      return errors;
    },
    saveLabel() {
      return this.uuid === null ? "Save" : "Update";
    }
  },
  validations: {
    name: { required, maxLength: maxLength(5) }
  },
  methods: {
    submit(callback) {
      this.uuid === null ? callback.create() : callback.update();

      this.$router.push({ name: "contractList" });
    },
    destroy(callback) {
      callback();

      this.$router.push({ name: "contractList" });
    },
    validateHours(data) {
      data.hours = "11:11";
    }
  }
};
</script>
