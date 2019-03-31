<template>
  <shift-model :uuid="uuid">
    <template v-slot="{ data: shift, create, update, destroy }">
      <v-card>
        <v-card-text>
          <v-layout row wrap align-center>
            <v-flex xs12 md5>
              <shift-form-date-time-input
                v-model="shift.date"
                :shift="shift"
                type="start"
              />
            </v-flex>
            <v-flex xs1>to</v-flex>
            <v-flex xs12 md5>
              <shift-form-date-time-input
                v-model="shift.date"
                :shift="shift"
                type="end"
              />
            </v-flex>
            <v-flex xs12 md7>
              <shift-form-select v-model="shift.type" />
            </v-flex>
            <v-flex xs12 md7>
              <shift-form-tags v-model="shift.tags" />
            </v-flex>
            <v-flex xs12 md7>
              <shift-form-input v-model="shift.note" />
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
  </shift-model>
</template>

<script>
import ShiftModel from "@/components/shifts/ShiftModel";
import ShiftFormDateTimeInput from "@/components/shifts/ShiftFormDateTimeInput";
import ShiftFormSelect from "@/components/shifts/ShiftFormSelect";
import ShiftFormInput from "@/components/shifts/ShiftFormInput";
import ShiftFormTags from "@/components/shifts/ShiftFormTags";

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
  computed: {
    saveLabel() {
      return this.uuid === null ? "Save" : "Update";
    }
  },
  methods: {
    submit(callback) {
      this.uuid === null ? callback.create() : callback.update();

      this.$router.push({ name: "shiftList" });
    },
    destroy(callback) {
      callback();

      this.$router.push({ name: "shiftList" });
    }
  }
};
</script>
