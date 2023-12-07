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
      @scheduleShifts="setScheduledShifts($event)"
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
import FormActions from "@/components/cards/FormActions";
import CardToolbar from "@/components/cards/CardToolbar";
import ShiftFormFields from "@/components/forms/modelForms/shift/ShiftFormFields";
import ShiftValidationMixin from "@/mixins/ShiftValidationMixin";
import { useVuelidate } from "@vuelidate/core";

import { isBefore } from "date-fns";
import { mapGetters } from "vuex";

export default {
  name: "ShiftForm",
  components: { ShiftFormFields, FormActions, CardToolbar },
  mixins: [ShiftValidationMixin],
  props: {
    value: {
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
      shift: this.value
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
        let date = this.$store.getters["selectedContract/selectedContract"]
          .startDate;
        date.setHours(10, 0, 0);
        if (isBefore(this.initialDate, date)) {
          return date;
        }
      }
      return this.initialDate;
    }
  },
  watch: {
    value(val) {
      this.shift = val;
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
      await this.$store.dispatch("contentData/updateShift", {
        payload: this.shift.toPayload(),
        initialContract: this.initialContract
      });
      this.$emit("update");
      this.close();
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
