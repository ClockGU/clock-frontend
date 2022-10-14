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
      <ContractForm :existing-contract="contract" :close="close"></ContractForm>
    </template>
  </TheDialog>
</template>

<script>
import TheDialog from "@/components/TheDialog";
import { Contract } from "@/models/ContractModel";
import ContractForm from "@/components/forms/modelFroms/contract/ContractForm";

export default {
  name: "ContractFormDialog",
  components: { ContractForm, TheDialog },
  props: {
    contract: {
      type: Contract,
      required: false,
      default: undefined
    }
  }
};
</script>

<style scoped></style>
