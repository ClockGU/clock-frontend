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
      :alert-messages="alertMessages"
      :time-errors="timeErrors"
      @scheduleShifts="setScheduledShifts($event)"
    ></ShiftFormFields>
    <FormActions
      :create-fn="saveShift"
      :delete-fn="deleteShift"
      :close-fn="closeFn"
      :update-fn="updateShift"
      :disable-save="false"
      :is-new-instance="isNewInstance"
      model-name="shift"
    ></FormActions>
  </v-card>
</template>

<script>
import { Shift } from "@/models/ShiftModel";
import FormActions from "@/components/cards/FormActions";
import CardToolbar from "@/components/cards/CardToolbar";
import ShiftFormFields from "@/components/forms/modelFroms/shift/ShiftFormFields";
import { ShiftService } from "@/services/models";
import ShiftValidationMixin from "@/mixins/ShiftValidationMixin";
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
  data() {
    return {
      newShift: undefined,
      scheduledShifts: undefined
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
    }
  },
  created() {
    this.initializeNewShift();
  },
  methods: {
    async saveShift() {
      const savedShift = await ShiftService.create(this.newShift.toPayload());
      this.$store.commit("contentData/addShift", {
        contractID: savedShift.contract,
        shiftInstance: savedShift
      });
      this.initializeNewShift();
      this.close();
    },
    async deleteShift() {
      await ShiftService.delete(this.newShift.id);
      this.$store.commit("contentData/removeShift", {
        contractID: this.newShift.contract,
        shiftInstance: this.newShift
      });
      this.initializeNewShift();
      this.close();
    },
    async updateShift() {
      const updatedShift = await ShiftService.update(
        this.newShift.toPayload(),
        this.newShift.id
      );
      this.$store.commit("contentData/updateShift", {
        contractID: this.newShift.contract,
        shiftInstance: updatedShift
      });
      this.close();
    },
    initializeNewShift() {
      this.newShift =
        this.existingShift !== undefined
          ? this.existingShift.clone()
          : new Shift();
    },
    setScheduledShifts(event) {
      this.scheduledShifts = event;
    },
    closeFn() {
      this.initializeNewShift();
      this.close();
    }
  }
};
</script>

<style scoped></style>
