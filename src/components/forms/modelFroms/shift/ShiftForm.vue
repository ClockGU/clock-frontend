<template>
  <v-card>
    <CardToolbar
      :title="title"
      :logout-action="false"
      close-action
      @close="close"
    ></CardToolbar>
    <ShiftFormFields v-model="newShift"></ShiftFormFields>
    <FormActions
      :create-fn="saveShift"
      :delete-fn="deleteShift"
      :close-fn="close"
      :update-fn="updateShift"
      :disable-save="false"
      show-delete
      model-name="shift"
      @close="initializeNewShift"
    ></FormActions>
  </v-card>
</template>

<script>
import { Shift } from "@/models/ShiftModel";
import FormActions from "@/components/cards/FormActions";
import CardToolbar from "@/components/cards/CardToolbar";
import ShiftFormFields from "@/components/forms/modelFroms/shift/ShiftFormFields";

export default {
  name: "ShiftForm",
  components: { ShiftFormFields, FormActions, CardToolbar },
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
      renderFields: true,
      theString: ""
    };
  },
  computed: {
    title() {
      return this.$t("forms.titleUpdate", { entity: "Shift" });
    }
  },
  created() {
    this.initializeNewShift();
  },
  methods: {
    saveShift() {
      console.log("Shift is saving ...");
      this.initializeNewShift();
      this.close();
    },
    deleteShift() {
      console.log("Shift is deleting ...");
      this.initializeNewShift();
      this.close();
    },
    updateShift() {
      console.log("Shift is updating ... ");
      this.initializeNewShift();
      this.close();
    },
    initializeNewShift() {
      this.newShift =
        this.existingShift !== undefined
          ? this.existingShift.clone()
          : new Shift();
    }
  }
};
</script>

<style scoped></style>
