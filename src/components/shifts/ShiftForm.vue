<template>
  <shift-model :uuid="uuid">
    <v-card min-width="90vw" slot-scope="{ data: shift, create, update }">
      <v-card-text>
        <v-layout row wrap align-center>
          <v-flex xs5>
            <shift-form-date-time-input :shift="shift" type="_start" />
          </v-flex>
          <v-flex xs1>to</v-flex>
          <v-flex xs5>
            <shift-form-date-time-input :shift="shift" type="_end" />
          </v-flex>
          <v-flex xs12>
            <shift-form-select :shift="shift" />
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat @click="submit({ create: create, update: update })"
          >Submit</v-btn
        >
      </v-card-actions>
    </v-card>
  </shift-model>
</template>

<script>
import ShiftModel from "@/components/shifts/ShiftModel";
import ShiftFormDateTimeInput from "@/components/shifts/ShiftFormDateTimeInput";
import ShiftFormSelect from "@/components/shifts/ShiftFormSelect";

export default {
  name: "ShiftForm",
  components: { ShiftModel, ShiftFormDateTimeInput, ShiftFormSelect },
  props: {
    uuid: {
      type: String,
      default: null
    }
  },
  methods: {
    submit(callback) {
      this.uuid === null ? callback.create() : callback.update();
    }
  }
};
</script>
