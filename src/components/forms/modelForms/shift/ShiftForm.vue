<template>
  <v-card class="mx-auto word-break" min-width="400" :max-width="600">
    <CardToolbar
      :title="title"
      :logout-action="false"
      close-action
      @close="closeFn"
    ></CardToolbar>
    <ShiftFormFields
      v-model="newShift"
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
import store from "@/store";
import { isBefore } from "date-fns";

export default {
  name: "ShiftForm",
  components: { ShiftFormFields, FormActions, CardToolbar },
  mixins: [ShiftValidationMixin],
  props: {
    existingShift: {
      type: [Shift, typeof undefined],
      required: false,
      default: undefined
    },
    initialDate: {
      type: Date,
      required: false,
      default: () => new Date()
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
      newShift: undefined,
      scheduledShifts: undefined,
      initialContract: "",
      saving: false,
      closed: false
    };
  },
  computed: {
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
      return this.newShift.id === "";
    },
    date() {
      if (this.newShift.contract === "") {
        let date = store.getters["selectedContract/selectedContract"].startDate;
        date.setHours(10, 0, 0);
        if (isBefore(this.initialDate, date)) {
          return date;
        }
      }
      return this.initialDate;
    }
  },
  watch: {
    existingShift() {
      this.initializeNewShift();
    },
    showErrors(opened) {
      this.closed = !opened;
    },
    initialDate() {
      this.initializeNewShift();
    }
  },
  created() {
    this.initializeNewShift();
  },
  mounted() {
    console.log("ShiftForm mounted");
  },
  methods: {
    async saveShift() {
      this.saving = true;
      await this.$store.dispatch(
        "contentData/saveShift",
        this.newShift.toPayload()
      );
      if (this.scheduledShifts !== undefined) {
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
      await this.$store.dispatch("contentData/deleteShift", this.newShift);
      this.$emit("delete");
      this.closeFn();
    },
    async updateShift() {
      await this.$store.dispatch("contentData/updateShift", {
        payload: this.newShift.toPayload(),
        initialContract: this.initialContract
      });
      this.$emit("update");
      this.close();
    },
    initializeNewShift() {
      let date = this.initialDate;
      if (this.existingShift === undefined) {
        const contractStartDate = this.$store.getters[
          "selectedContract/selectedContract"
        ].startDate;

        if (isBefore(this.initialDate, contractStartDate)) {
          date = contractStartDate;
        }
      }
      let started = new Date(date);
      started.setHours(10, 0, 0, 0);
      let stopped = new Date(date);
      stopped.setHours(10, 30, 0, 0);
      this.newShift =
        this.existingShift !== undefined
          ? this.existingShift.clone()
          : new Shift({ started: started, stopped: stopped });
      this.initialContract = this.newShift.contract;
    },
    setScheduledShifts(event) {
      this.scheduledShifts = event;
    },
    closeFn() {
      this.closed = true;
      this.v$.$reset();
      this.initializeNewShift();
      this.close();
      this.$emit("close");
    }
  }
};
</script>

<style scoped></style>
