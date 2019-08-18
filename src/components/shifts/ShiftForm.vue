<template>
  <ShiftModel
    :id="uuid"
    :entity="initialData"
    endpoint="api/shifts"
    @success="redirect"
  >
    <template v-slot="{ data: shift, create, update, destroy, loading }">
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
          <v-layout wrap align-center>
            <v-flex xs12>
              <v-select
                v-model="shift.contract"
                :items="contracts"
                item-text="name"
                item-value="uuid"
                label="Please select a contract"
              ></v-select>
            </v-flex>
            <v-flex xs12 md5>
              <ShiftFormDateTimeInput
                v-model="shift.date"
                :shift="shift"
                type="start"
              />
            </v-flex>
            <v-flex xs1>to</v-flex>
            <v-flex xs12 md5>
              <ShiftFormDateTimeInput
                v-model="shift.date"
                :shift="shift"
                type="end"
              />
            </v-flex>
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
        <v-card-actions>
          <v-btn v-if="uuid" text @click="remove(destroy)">Delete</v-btn>
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="submit({ create: create, update: update }, shift)"
            >{{ saveLabel }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </template>
  </ShiftModel>
</template>

<script>
import ShiftModel from "@/components/ShiftModel";
import ShiftFormDateTimeInput from "@/components/shifts/ShiftFormDateTimeInput";
import ShiftFormSelect from "@/components/shifts/ShiftFormSelect";
import ShiftFormInput from "@/components/shifts/ShiftFormInput";
import ShiftFormTags from "@/components/shifts/ShiftFormTags";

import { Shift } from "@/models/Shifts";

import { mapState } from "vuex";

export default {
  name: "ShiftForm",
  components: {
    ShiftModel,
    ShiftFormDateTimeInput,
    ShiftFormInput,
    ShiftFormSelect,
    ShiftFormTags
  },
  props: {
    uuid: {
      type: String,
      default: null
    }
  },
  data: () => ({
    select: null
  }),
  computed: {
    ...mapState("contract", {
      contracts: state => state.contracts
    }),
    initialData() {
      return this.uuid
        ? null
        : new Shift({
            date: { start: new Date(), end: new Date() },
            contracts: null
          });
    },
    title() {
      return this.uuid === null ? "Add shift" : "Update shift";
    },
    saveLabel() {
      return this.uuid === null ? "Save" : "Update";
    }
  },
  methods: {
    submit(callback, shift) {
      const payload = shift.toPayload();
      this.uuid === null ? callback.create(payload) : callback.update(payload);
    },
    redirect() {
      this.$router.push({ name: "c" });
    },
    remove(callback) {
      callback();
    }
  }
};
</script>
