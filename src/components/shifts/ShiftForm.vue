<template>
  <v-container fluid>
    <FrameApi
      v-slot="{ methods: { query }, status: { error, loading } }"
      :endpoint="endpoint"
      @success="redirect"
    >
      <v-form>
        <v-row>
          <v-col>
            <h1>
              {{ title }}
            </h1>
          </v-col>
        </v-row>

        <v-row dense>
          <v-col sm="12">
            <v-card min-width="330">
              <v-row>
                <v-col cols="12" sm="12" md="7">
                  <v-subheader>Select the shift date</v-subheader>
                  <v-card-text class="pt-0">
                    <ShiftFormDateInlineInput
                      v-model="shift"
                      :min="contract.date.start"
                      :max="contract.date.end"
                    />
                  </v-card-text>
                </v-col>
                <v-col cols="12" sm="12" md="5">
                  <v-subheader
                    >What time did you start and end your shift?</v-subheader
                  >
                  <v-card-text>
                    <ShiftFormTimeInput
                      v-model="shift"
                      :errors="startTimeErrors"
                      label="Start time"
                      type="start"
                      @update="
                        $v.shift.date.start.$touch() ||
                          $v.shift.date.end.$touch()
                      "
                    />
                  </v-card-text>
                  <v-card-text>
                    <ShiftFormTimeInput
                      v-model="shift"
                      :errors="endTimeErrors"
                      label="End time"
                      type="end"
                      @update="
                        $v.shift.date.end.$touch() ||
                          $v.shift.date.start.$touch()
                      "
                    />
                  </v-card-text>
                </v-col>
              </v-row>
            </v-card>
          </v-col>

          <v-col cols="12" sm="12">
            <v-card>
              <v-row>
                <v-col>
                  <v-subheader>
                    Additional information
                  </v-subheader>
                  <v-card-text>
                    <ShiftFormSelect v-model="shift.type" />
                    <ShiftFormTags v-model="shift.tags" />
                    <ShiftFormInput v-model="shift.note" />
                  </v-card-text>
                </v-col>
              </v-row>
            </v-card>
          </v-col>

          <v-col cols="12" sm="12">
            <v-card>
              <v-row>
                <v-col>
                  <v-subheader>
                    Change contract
                  </v-subheader>
                  <v-card-text>
                    <v-select
                      v-model="shift.contract"
                      :items="contracts"
                      item-text="name"
                      item-value="uuid"
                      label="Select a contract"
                      outlined
                    ></v-select>
                  </v-card-text>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
          <v-col>
            <v-card>
              <v-card-actions>
                <v-btn
                  text
                  :disabled="!valid"
                  color="primary"
                  @click="submit(query, shift)"
                >
                  {{ saveLabel }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-form>
    </FrameApi>
  </v-container>
</template>

<script>
import ShiftFormDateInlineInput from "@/components/shifts/ShiftFormDateInlineInput";
import ShiftFormTimeInput from "@/components/shifts/ShiftFormTimeInput";
import ShiftFormSelect from "@/components/shifts/ShiftFormSelect";
import ShiftFormInput from "@/components/shifts/ShiftFormInput";
import ShiftFormTags from "@/components/shifts/ShiftFormTags";
import FrameApi from "@/components/FrameApi";

import ShiftService from "@/services/shift.service";

import { Shift } from "@/models/ShiftModel";
import { Contract } from "@/models/ContractModel";

import { mapState } from "vuex";
import { format, isAfter, isBefore } from "date-fns";

import { startEndHours } from "@/utils/time";

import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";

const startBeforeEnd = (value, vm) => isBefore(value, vm.end);
const endAfterStart = (value, vm) => isAfter(value, vm.start);

export default {
  name: "ShiftForm",
  components: {
    FrameApi,
    ShiftFormDateInlineInput,
    ShiftFormTimeInput,
    ShiftFormInput,
    ShiftFormSelect,
    ShiftFormTags
  },
  filters: {
    formatDate(date) {
      return format(date, "YYYY-MM-DD");
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
    shift: null,
    stepper: 1,
    stepperText: [
      {
        title: "Time and date",
        subtitle: "Choose the date and start/end times of your shift."
      },
      {
        title: "Set the hours per month",
        subtitle: "Your montly worktime (HH:mm)."
      },
      {
        title: "Summary",
        subtitle: " "
      }
    ]
  }),
  computed: {
    ...mapState("contract", {
      contracts: state => state.contracts
    }),
    currentText() {
      return this.stepperText[this.stepper - 1];
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
      const now = new Date();
      return new Shift({
        date: { ...startEndHours(now) },
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
  watch: {
    // Make sure to set the date to the first day of the contract,
    // when the user changes the contract.
    "shift.contract": function(newValue, oldValue) {
      if (oldValue === undefined) return;

      const contractStart = this.contract.date.start;
      const contractEnd = this.contract.date.end;
      const now = Date.now();

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
  },
  created() {
    this.shift = this.uuid === null ? this.initialData : this.entity;

    if (!this.shift.contract) {
      this.shift.contract = this.$store.state.selectedContract.uuid;
    }

    this.endpoint = data =>
      this.uuid === null
        ? ShiftService.create(data)
        : ShiftService.update(data, this.uuid);
  },
  methods: {
    nextStep() {
      this.stepper += 1;
    },
    previousStep() {
      this.stepper -= 1;
    },
    async submit(callback, shift) {
      const payload = shift.toPayload();
      await callback(payload);
    },
    redirect({ data }) {
      return new Promise((resolve, reject) => {
        data
          .then(() => {
            this.$router.push({ name: "c" });

            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    async destroy() {
      if (this.uuid === null) return;

      await ShiftService.delete(this.uuid);

      this.redirect();
    }
  }
};
</script>
