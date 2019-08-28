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
          <v-btn v-if="uuid" text @click="destroy()">Delete</v-btn>
          <v-spacer></v-spacer>
          <v-btn text @click="submit(query, contract)">{{ saveLabel }}</v-btn>
        </v-card-actions>
      </v-card>
    </FrameApi>
  </v-form>
</template>

<script>
import ContractFormDateInput from "@/components/contracts/ContractFormDateInput";
import FrameApi from "@/FrameApi";
import ContractService from "@/services/contract.service";

import { Contract } from "@/models/Contracts";

export default {
  name: "ContractForm",
  components: { FrameApi, ContractFormDateInput },
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
    valid: false
  }),
  computed: {
    initialData() {
      return new Contract({
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
