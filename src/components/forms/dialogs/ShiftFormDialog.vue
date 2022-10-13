<template>
  <TheDialog
    :fullscreen="$vuetify.breakpoint.smAndDown"
    :max-width="600"
    :persistent="false"
  >
    <template #activator="{ on }">
      <v-btn v-on="on"> Open Dialog</v-btn>
    </template>
    <template #content="{ events: { close } }">
      <ShiftForm :existing-shift="shift" :close="close"></ShiftForm>
    </template>
  </TheDialog>
</template>

<script>
import TheDialog from "@/components/TheDialog";
import ShiftForm from "@/components/forms/modelFroms/shift/ShiftForm";
import { Shift } from "@/models/ShiftModel";
export default {
  name: "ShiftFormDialogexample",
  components: { ShiftForm, TheDialog },
  props: {
    shift: {
      type: Shift,
      required: false,
      default: undefined
    }
  }
};
</script>

<style scoped></style>
