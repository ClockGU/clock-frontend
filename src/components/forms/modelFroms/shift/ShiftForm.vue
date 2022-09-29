<template>
  <v-card>
    <CardToolbar
      :title="title"
      :logout-action="false"
      close-action
      @close="close"
    ></CardToolbar>
    <ShiftFormFields v-model="newShift"></ShiftFormFields>
    <span>{{ smth }}</span>
    <FormActions
      :create-fn="saveShift"
      :delete-fn="deleteShift"
      :close="close"
      :update-fn="updateShift"
      :disable-save="false"
      show-delete
      model-name="shift"
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
      type: Shift,
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
      newShift: undefined
    };
  },
  computed: {
    smth() {
      console.log(JSON.stringify(this.newShift));
      return "";
    },
    title() {
      return this.$t("forms.titleUpdate", { entity: "Shift" });
    }
  },
  created() {
    this.newShift =
      this.existingShift !== undefined
        ? this.existingShift.clone()
        : new Shift();
  },
  methods: {
    saveShift() {
      console.log("Shift is saving ...");
    },
    deleteShift() {
      console.log("Shift is deleting ...");
    },
    updateShift() {
      console.log("Shift is updating ... ");
    }
  }
};
</script>

<style scoped></style>
