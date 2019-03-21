<template>
  <shift-model :uuid="uuid">
    <template v-slot="{ data: shift, create, update }">
      <v-card>
        <v-card-text>
          <v-layout row wrap align-center>
            <v-flex xs5>
              <shift-form-date-time-input
                v-model="shift.date"
                :shift="shift"
                type="start"
              />
            </v-flex>
            <v-flex xs1>to</v-flex>
            <v-flex xs5>
              <shift-form-date-time-input
                v-model="shift.date"
                :shift="shift"
                type="end"
              />
            </v-flex>
            <v-flex xs12>
              <shift-form-select v-model="shift.type" />
            </v-flex>
            <v-flex xs12>
              <shift-form-input v-model="shift.note" />
            </v-flex>
            <v-flex xs12>
              <shift-form-tags v-model="shift.tags" />
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
    </template>
  </shift-model>
</template>

<script>
import ShiftModel from "@/components/shifts/ShiftModel";
import ShiftFormDateTimeInput from "@/components/shifts/ShiftFormDateTimeInput";
import ShiftFormDateInput from "@/components/shifts/ShiftFormDateInput";
import ShiftFormSelect from "@/components/shifts/ShiftFormSelect";
import ShiftFormInput from "@/components/shifts/ShiftFormInput";
import ShiftFormTags from "@/components/shifts/ShiftFormTags";

export default {
  name: "ShiftForm",
  components: {
    ShiftModel,
    ShiftFormDateInput,
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
  methods: {
    submit(callback) {
      this.uuid === null ? callback.create() : callback.update();
    }
  }
};
</script>
