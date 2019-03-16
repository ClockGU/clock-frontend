<template>
  <shift-model :uuid="uuid">
    <v-card min-width="90vw" slot-scope="{ data: shift, create, update }">
      <v-card-text>
        <v-layout row align-center>
          <v-flex xs6>
            <shift-form-date-time-input :shift="shift" type="_start" />
          </v-flex>
          <v-flex offset-xs1 xs1>to</v-flex>
          <shift-form-date-time-input :shift="shift" type="_end" />
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

export default {
  name: "ShiftForm",
  components: { ShiftModel, ShiftFormDateTimeInput },
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
