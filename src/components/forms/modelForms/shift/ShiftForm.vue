<template>
  <v-card class="mx-auto word-break" min-width="400" :max-width="600">
    <CardToolbar
      :title="title"
      :logout-action="false"
      close-action
      @close="closeFn"
    ></CardToolbar>
    <ShiftFormFields
      v-model="shift"
      :alert-messages="messages"
      :alert-type="errorMessages.length > 0 ? 'error' : 'warning'"
      @schedule-shifts="setScheduledShifts($event)"
      @update:model-value="$emit('update:modelValue', $event)"
    ></ShiftFormFields>
    <FormActions
      :create-fn="saveShift"
      :delete-fn="deleteShift"
      :close-fn="closeFn"
      :update-fn="updateShift"
      :disable-save="!valid"
      :is-new-instance="isNewInstance"
      model-name="shift"
    ></FormActions>
  </v-card>
</template>

<script>
import { Shift } from "@/models/ShiftModel";
import FormActions from "@/components/cards/FormActions.vue";
import CardToolbar from "@/components/cards/CardToolbar.vue";
import ShiftFormFields from "@/components/forms/modelForms/shift/ShiftFormFields.vue";
import ShiftValidationMixin from "@/mixins/ShiftValidationMixin";
import { useVuelidate } from "@vuelidate/core";
import { isBefore } from "date-fns";
import { localizedFormat } from "@/utils/date";

import { mapGetters } from "vuex";

export default {
  name: "ShiftForm",
  components: { ShiftFormFields, FormActions, CardToolbar },
  mixins: [ShiftValidationMixin],
  props: {
    modelValue: {
      type: [Shift, typeof undefined],
      required: false,
      default: () => new Shift()
    },
    initialDate: {
      type: Date,
      required: false,
      default: () => new Date()
    },
    initialContract: {
      type: String,
      required: false,
      default: ""
    },
    close: {
      type: Function,
      required: false,
      default: () => {}
    },
    showErrors: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  emits: ["delete", "update", "close", "save", "update:modelValue"],
  setup() {
    return {
      v$: useVuelidate()
    };
  },
  data() {
    return {
      scheduledShifts: undefined,
      saving: false,
      closed: false,
      shift: this.modelValue,
      originalShift: this.modelValue.clone()
    };
  },
  computed: {
    ...mapGetters({
      selectedContract: "selectedContract/selectedContract"
    }),
    title() {
      if (this.isNewInstance) {
        return this.$t("forms.titleAdd", {
          entity: this.$tc("models.shift", 1)
        });
      }
      return this.$t("forms.titleUpdate", {
        entity: this.$tc("models.shift", 1)
      });
    },
    messages() {
      return this.saving || this.closed
        ? []
        : this.errorMessages.concat(this.alertMessages);
    },
    isNewInstance() {
      return this.shift.id === "";
    },
    date() {
      if (this.newShift.contract === "") {
        let date;
        try {
          date = this.$store.getters["selectedContract/selectedContract"]
            .startDate;
          date.setHours(10, 0, 0);
        } catch {
          return this.initialDate;
        }
        if (isBefore(this.initialDate, date)) {
          return date;
        }
      }
      return this.initialDate;
    }
  },
  watch: {
    modelValue(val) {
      this.shift = val;
      this.originalShift = val.clone();
    },
    showErrors(opened) {
      this.closed = !opened;
    }
  },
  methods: {
    async saveShift() {
      this.saving = true;
      await this.$store.dispatch(
        "contentData/saveShift",
        this.shift.toPayload()
      );
      if (
        this.scheduledShifts !== undefined &&
        Array.isArray(this.scheduledShifts)
      ) {
        await this.$store.dispatch(
          "contentData/bulkCreateShifts",
          this.scheduledShifts
        );
      }
      this.$emit("save");
      this.closeFn();
      this.saving = false;
    },
    async deleteShift() {
      await this.$store.dispatch("contentData/deleteShift", this.shift);
      this.$emit("delete");
      this.closeFn();
    },
    async updateShift() {
      const changedFields = this.getChangedFields(
        this.originalShift,
        this.shift
      );
      if (Object.keys(changedFields).length === 1) {
        return;
      }
      const payload = this.mapChangedFieldsToApi(changedFields);
      await this.$store.dispatch("contentData/updateShift", {
        payload: payload,
        initialContract: this.initialContract
      });
      this.$emit("update");
      this.close();
    },
    getChangedFields(oldShift, newShift) {
      const changes = { id: oldShift.id };
      for (const key in newShift) {
        if (newShift.hasOwnProperty(key) && oldShift.hasOwnProperty(key)) {
          if (key === "createdAt" || key === "modifiedAt") {
            continue;
          }
          if (newShift[key] instanceof Date && oldShift[key] instanceof Date) {
            if (newShift[key].getTime() !== oldShift[key].getTime()) {
              changes[key] = newShift[key];
            }
          } else if (newShift[key] !== oldShift[key]) {
            changes[key] = newShift[key];
          }
        }
      }
      return changes;
    },
    mapChangedFieldsToApi(changedFields) {
      const changedFieldsApi = {};
      for (const key in changedFields) {
        if (
          changedFields.hasOwnProperty(key) &&
          changedFields[key] !== undefined
        ) {
          switch (key) {
            case "started":
            case "stopped":
              changedFieldsApi[key] = localizedFormat(
                changedFields[key],
                "yyyy-MM-dd HH:mm:ssXXX",
                {
                  locale: { localize: "en" }
                }
              );
              break;
            case "wasReviewed":
              changedFieldsApi.was_reviewed = changedFields[key];
              break;
            default:
              changedFieldsApi[key] = changedFields[key];
          }
        }
      }
      return changedFieldsApi;
    },

    setScheduledShifts(event) {
      this.scheduledShifts = event;
    },
    closeFn() {
      this.closed = true;
      this.v$.$reset();
      this.close();
      this.$emit("close");
    }
  }
};
</script>

<style scoped></style>
