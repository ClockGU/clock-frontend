<template>
  <v-card>
    <CardToolbar
      :title="title"
      :logout-action="false"
      close-action
      @close="close"
    ></CardToolbar>
    <v-card-text>
      {{ stringForm }}
    </v-card-text>
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

export default {
  name: "ShiftForm",
  components: { FormActions, CardToolbar },
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
  computed: {
    title() {
      return this.$t("forms.titleUpdate", { entity: "Shift" });
    },
    stringForm() {
      if (this.existingShift === undefined) return "";
      return JSON.stringify(this.existingShift, null, 4);
    }
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
