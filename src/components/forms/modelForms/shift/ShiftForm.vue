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
      @scheduleShifts="setScheduledShifts($event)"
    ></ShiftFormFields>
    <!--      :alert-messages="saving ? [] : errorMessages.concat(alertMessages)"-->
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
import { addMinutes, isSameDay } from "date-fns";
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
    close: {
      type: Function,
      required: false,
      default: () => {}
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
      saving: false
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
    isNewInstance() {
      return this.newShift.id === "";
    },
    defaultStart() {
      const todaysShifts = this.$store.getters[
        "contentData/selectedShifts"
      ].filter((item) => {
        return isSameDay(item.stopped, new Date());
      });
      let defaultStart = new Date();
      defaultStart.setHours(10, 0, 0);
      if (todaysShifts.length) {
        defaultStart = todaysShifts.slice(-1)[0].stopped;
      }
      return defaultStart;
    }
  },
  watch: {
    existingShift() {
      console.log("watcher executed");
      this.initializeNewShift();
    }
  },
  created() {
    console.log("created run");
    this.initializeNewShift();
  },
  methods: {
    async saveShift() {
      this.saving = true;
      await this.$store.dispatch(
        "contentData/saveShift",
        this.newShift.toPayload()
      );
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
      this.newShift =
        this.existingShift !== undefined
          ? this.existingShift.clone()
          : new Shift({
              started: this.defaultStart,
              stopped: addMinutes(this.defaultStart, 30)
            });
      this.initialContract = this.newShift.contract;
    },
    setScheduledShifts(event) {
      this.scheduledShifts = event;
    },
    closeFn() {
      this.v$.$reset();
      this.initializeNewShift();
      this.close();
    }
  }
};
</script>

<style scoped></style>
