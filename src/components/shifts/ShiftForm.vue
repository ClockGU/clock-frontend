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

    <v-row>
      <v-col>
        <h1>{{ title }}</h1>
      </v-col>
    </v-row>

    <v-row dense>
      <v-col sm="12">
        <v-card min-width="330">
          <v-row>
            <v-col cols="12" sm="12" md="7">
              <v-subheader>Select shift date</v-subheader>
              <v-card-text class="pt-0">
                <v-row justify="center">
                  <ShiftFormDateInlineInput
                    v-model="shift"
                    data-cy="shift-date"
                    :min="contract.date.start"
                    :max="contract.date.end"
                  />
                </v-row>
              </v-card-text>
            </v-col>
            <v-col cols="12" sm="12" md="5">
              <v-subheader
                >What time did you start and end your shift?</v-subheader
              >
              <v-card-text>
                <ShiftFormTimeInput
                  v-model="shift"
                  data-cy="shift-start-time"
                  :errors="startTimeErrors"
                  label="Start time"
                  type="start"
                  @update="
                    $v.shift.date.start.$touch() || $v.shift.date.end.$touch()
                  "
                />
              </v-card-text>
              <v-card-text>
                <ShiftFormTimeInput
                  v-model="shift"
                  data-cy="shift-end-time"
                  :errors="endTimeErrors"
                  label="End time"
                  type="end"
                  @update="
                    $v.shift.date.end.$touch() || $v.shift.date.start.$touch()
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
              <v-subheader>Additional information</v-subheader>
              <v-card-text>
                <ShiftFormSelect v-model="shift.type" data-cy="shift-type" />
                <ShiftFormTags v-model="shift.tags" data-cy="shift-tags" />
                <ShiftFormInput v-model="shift.note" data-cy="shift-note" />
              </v-card-text>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <v-col cols="12" sm="12">
        <v-expansion-panels>
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
      <v-col>
        <v-card>
          <v-card-actions>
            <v-btn
              data-cy="shift-save"
              text
              :disabled="!valid"
              color="primary"
              @click="submit(query, shift)"
              >{{ saveLabel }}</v-btn
            >
            <v-btn data-cy="shift-cancel" text @click="$emit('cancel')"
              >Cancel</v-btn
            >
            <v-spacer></v-spacer>

            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on }">
                <v-slide-x-transition>
                  <v-btn
                    v-if="uuid !== null"
                    data-cy="shift-form-delete-button"
                    text
                    :disabled="deleteDisabled"
                    color="error"
                    v-on="on"
                  >
                    Delete
                  </v-btn>
                </v-slide-x-transition>
              </template>

              <v-card data-cy="delete-dialog">
                <v-card-title>
                  <span class="headline">Delete shifts?</span>
                </v-card-title>

                <v-card-text>
                  Are you sure you want to delete the selected shifts? This
                  action is permanent.
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    data-cy="delete-confirm"
                    color="error"
                    text
                    @click="destroy"
                  >
                    Delete
                  </v-btn>
                  <v-btn data-cy="delete-cancel" text @click="dialog = false">
                    Cancel
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import ShiftFormDateInlineInput from "@/components/shifts/ShiftFormDateInlineInput";
import ShiftFormTimeInput from "@/components/shifts/ShiftFormTimeInput";
import ShiftFormSelect from "@/components/shifts/ShiftFormSelect";
import ShiftFormInput from "@/components/shifts/ShiftFormInput";
import ShiftFormTags from "@/components/shifts/ShiftFormTags";

import ShiftService from "@/services/shift";

import { Shift } from "@/models/ShiftModel";
import { Contract } from "@/models/ContractModel";

import { mapGetters } from "vuex";
import { format, isAfter, isBefore } from "date-fns";

import { startEndHours } from "@/utils/time";

import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import { handleApiError } from "@/utils/interceptors";

const startBeforeEnd = (value, vm) => isBefore(value, vm.end);
const endAfterStart = (value, vm) => isAfter(value, vm.start);

export default {
  name: "ShiftForm",
  components: {
    ShiftFormDateInlineInput,
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
    },
    query: {
      type: Function,
      required: true
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
    }
  },
  created() {
    this.shift = this.uuid === null ? this.initialData : this.entity;

    if (!this.shift.contract) {
      this.shift.contract = this.selectedContract.uuid;
    }
  },
  methods: {
    destroy() {
      ShiftService.delete(this.uuid)
        .then(() => {
          this.$store.dispatch("shift/queryShifts");
        })
        .catch(handleApiError)
        .finally(() => {
          this.dialog = false;
          this.$emit("redirect");
        });
    },
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
    },
    async submit(callback, shift) {
      callback(shift)
        .then(() => this.$emit("submit"))
        .catch(handleApiError);
    }
  }
};
</script>
