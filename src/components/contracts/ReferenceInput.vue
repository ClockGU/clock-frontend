<script setup>
import {
  mdiIdentifier,
  mdiRotate3dVariant,
  mdiClipboardFileOutline
} from "@mdi/js";
import { v4 as uuidv4 } from "uuid";

const model = defineModel({ type: String });

async function copyToClipboard() {
  const type = "text/plain";
  const blob = new Blob([model.value], { type });
  const data = [new ClipboardItem({ [type]: blob })];
  await navigator.clipboard.write(data);
}
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
    >
      <template #append-inner="{ props }">
        <v-btn :v-bind="props" variant="text" :icon="mdiClipboardFileOutline" aria-label="Copy to clipboard" @click="copyToClipboard"></v-btn>
      </template>
    </v-text-field>
    <v-btn
      :icon="mdiRotate3dVariant"
      style="margin-inline: 8px"
      @click="model = uuidv4()"
    ></v-btn>
  </div>
</template>

<style scoped>

:deep(.v-messages__message) {
  line-height: 1.33333;
}

</style>
