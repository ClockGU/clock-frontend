<template>
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
        <v-btn v-if="uuid" text @click="destroy()">Delete</v-btn>
        <v-spacer></v-spacer>
        <v-btn text @click="submit(query, shift)">{{ saveLabel }}</v-btn>
      </v-card-actions>
    </v-card>
  </FrameApi>
</template>

<script>
import ShiftFormDateTimeInput from "@/components/shifts/ShiftFormDateTimeInput";
import ShiftFormSelect from "@/components/shifts/ShiftFormSelect";
import ShiftFormInput from "@/components/shifts/ShiftFormInput";
import ShiftFormTags from "@/components/shifts/ShiftFormTags";
import FrameApi from "@/FrameApi";
import ShiftService from "@/services/shift.service";
import { Shift } from "@/models/Shifts";

import { mapState } from "vuex";

export default {
  name: "ShiftForm",
  components: {
    FrameApi,
    ShiftFormDateTimeInput,
    ShiftFormInput,
    ShiftFormSelect,
    ShiftFormTags
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
    select: null,
    shift: null
  }),
  computed: {
    ...mapState("contract", {
      contracts: state => state.contracts
    }),
    initialData() {
      return new Shift({
        date: { start: new Date(), end: new Date() },
        contracts: null,
        type: "st"
      });
    },
    title() {
      return this.uuid === null ? "Add shift" : "Update shift";
    },
    saveLabel() {
      return this.uuid === null ? "Save" : "Update";
    }
  },
  created() {
    this.shift = this.uuid === null ? this.initialData : this.entity;

    this.endpoint = data =>
      this.uuid === null
        ? ShiftService.create(data)
        : ShiftService.update(data, this.uuid);
  },
  methods: {
    async submit(callback, shift) {
      const payload = shift.toPayload();
      await callback(payload);

      this.redirect();
    },
    redirect() {
      this.$router.push({ name: "c" });
    },
    async destroy() {
      if (this.uuid === null) return;

      await ShiftService.delete(this.uuid);

      this.redirect();
    }
  }
};
</script>
