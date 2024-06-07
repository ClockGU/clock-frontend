<script setup>
import {
  mdiIdentifier,
  mdiRotate3dVariant,
  mdiInformationOutline
} from "@mdi/js";
import { v4 as uuidv4 } from "uuid";

const model = defineModel({ type: String });
</script>

<template>
  <div class="d-flex">
    <v-text-field
      :model-value="model"
      readonly
      :label="$t('contracts.reference')"
      :prepend-icon="mdiIdentifier"
      :hint="$t('contracts.referenceExplanation')"
      persistent-hint
      variant="filled"
      required
      @mouseup.stop
    />
    <v-btn
      :icon="mdiRotate3dVariant"
      style="margin-inline: 8px"
      @click="model = uuidv4()"
    ></v-btn>
  </div>
</template>

<style scoped></style>
