<template>
  <v-form>
    <v-overlay v-if="shiftExported" light :dark="false">
      <v-card data-cy="overlay" class="mx-auto" max-width="300">
        <v-card-title class="headline">
          I'm sorry Dave, I'm afraid I can't do that!
        </v-card-title>

        <v-card-text>
          The report for this shift was already exported. You can't edit this
          shift anymore.
        </v-card-text>

        <v-card-actions>
          <v-btn data-cy="overlay-ack" color="primary" text :to="{ path: '/' }">
            OK, take me back
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-overlay>

    <v-row align="center" justify="center">
      <v-col cols="5" md="4">
        <ShiftFormDateInput
          v-model="shift"
          data-cy="shift-date"
          :min="contract.date.start"
          :max="contract.date.end"
          label="Date"
        />
      </v-col>

      <v-col cols="3" md="2">
        <ShiftFormTimeInput
          v-model="shift"
          data-cy="shift-start-time"
          :errors="startTimeErrors"
          label="Start"
          type="start"
          @update="$v.shift.date.start.$touch() || $v.shift.date.end.$touch()"
        />
      </v-col>

      <v-col cols="1" class="px-0 text-center">
        to
      </v-col>

      <v-col cols="3" md="2">
        <ShiftFormTimeInput
          v-model="shift"
          data-cy="shift-end-time"
          :errors="endTimeErrors"
          label="End"
          type="end"
          @update="$v.shift.date.end.$touch() || $v.shift.date.start.$touch()"
        />
      </v-col>

      <v-col cols="12" md="10">
        <ShiftFormSelect v-model="shift.type" data-cy="shift-type" />
        <ShiftFormTags v-model="shift.tags" data-cy="shift-tags" />
        <ShiftFormInput v-model="shift.note" data-cy="shift-note" />
      </v-col>

      <v-col cols="12" md="10">
        <v-expansion-panels :elevation="0">
          <v-expansion-panel>
            <v-expansion-panel-header
              >Advanced settings</v-expansion-panel-header
            >
            <v-expansion-panel-content>
              <v-subheader>Change contract</v-subheader>

              <v-select
                v-model="shift.contract"
                data-cy="shift-contract"
                :items="contracts"
                item-text="name"
                item-value="uuid"
                outlined
              ></v-select>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import ShiftFormDateInput from "@/components/shifts/ShiftFormDateInput";
import ShiftFormTimeInput from "@/components/shifts/ShiftFormTimeInput";
import ShiftFormSelect from "@/components/shifts/ShiftFormSelect";
import ShiftFormInput from "@/components/shifts/ShiftFormInput";
import ShiftFormTags from "@/components/shifts/ShiftFormTags";

import { Shift } from "@/models/ShiftModel";
import { Contract } from "@/models/ContractModel";

import { mapGetters } from "vuex";
import { format, isAfter, isBefore } from "date-fns";

import { startEndHours } from "@/utils/time";

import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";

const startBeforeEnd = (value, vm) => isBefore(value, vm.end);
const endAfterStart = (value, vm) => isAfter(value, vm.start);

export default {
  name: "ShiftForm",
  components: {
    ShiftFormDateInput,
    ShiftFormTimeInput,
    ShiftFormInput,
    ShiftFormSelect,
    ShiftFormTags
  },
  filters: {
    formatDate(date) {
      return format(date, "yyyy-MM-dd");
    },
    formatTime(date) {
      return format(date, "HH:mm");
    }
  },
  mixins: [validationMixin],
  validations: {
    shift: {
      date: {
        start: { required, startBeforeEnd },
        end: { required, endAfterStart }
      }
    }
  },
  props: {
    now: {
      type: Date,
      default: () => new Date()
    },
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
    dialog: false,
    select: null,
    shift: null
  }),
  computed: {
    ...mapGetters({
      contracts: "contract/contracts",
      selectedContract: "selectedContract"
    }),
    shiftExported() {
      return this.shift.exported;
    },
    tags() {
      return this.shift.tags.join(", ");
    },
    contract() {
      return new Contract(
        this.contracts.find(contract => contract.uuid === this.shift.contract)
      );
    },
    valid() {
      if (
        isAfter(this.shift.date.start, this.shift.date.end) ||
        isBefore(this.shift.date.end, this.shift.date.start)
      )
        return false;

      return true;
    },
    startTimeErrors() {
      const errors = [];
      if (!this.$v.shift.date.start.$dirty) return errors;

      (!this.$v.shift.date.start.required ||
        !!this.$v.shift.date.start.biggerThan23) &&
        errors.push("You must specify a start time.");

      !this.$v.shift.date.start.startBeforeEnd &&
        errors.push("A shift must start before it ends.");

      return errors;
    },
    endTimeErrors() {
      const errors = [];
      if (!this.$v.shift.date.end.$dirty) return errors;

      !this.$v.shift.date.end.required &&
        errors.push("You must specify a start time.");

      !this.$v.shift.date.end.endAfterStart &&
        errors.push("A shift must end after it starts.");

      return errors;
    },
    initialData() {
      return new Shift({
        date: { ...startEndHours(this.now) },
        contract: null,
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
  watch: {
    "shift.contract": function() {
      this.setStartDate();
    },
    shift: {
      handler: function() {
        this.$emit("update", { shift: this.shift, valid: this.valid });
      },
      deep: true
    }
  },
  created() {
    this.shift = this.uuid === null ? this.initialData : this.entity;

    if (!this.shift.contract) {
      this.shift.contract = this.selectedContract.uuid;
    }
  },
  methods: {
    setStartDate() {
      const contractStart = this.contract.date.start;
      const contractEnd = this.contract.date.end;
      const now = this.now;

      // Do nothing if current date is inside the
      // selected contract
      if (
        isBefore(new Date(contractStart), this.shift.date.start) &&
        isAfter(new Date(contractEnd), this.shift.date.end)
      ) {
        return;
      }

      // Always set Date.now(), if today is inbetween the
      // start and end date of a contract.
      if (
        isBefore(new Date(contractStart), now) &&
        isAfter(new Date(contractEnd), now)
      ) {
        this.shift.setToday();
        return;
      }

      const [year, month, day] = contractStart.split("-");
      this.shift.setDate(...[year, month - 1, day], "start");
      this.shift.setDate(...[year, month - 1, day], "end");
    }
  }
};
</script>
