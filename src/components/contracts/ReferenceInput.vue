<script setup>
import {
  mdiIdentifier,
  mdiRotate3dVariant,
  mdiInformationOutline
} from "@mdi/js";

const model = defineModel({ type: String });
</script>

<template>
  <div class="d-flex">
    <v-text-field
      v-model="model"
      :label="$t('contracts.reference')"
      :prepend-icon="mdiIdentifier"
      :hint="$t('contracts.referenceExplanation')"
      persistent-hint
      variant="filled"
      required
    />
    <v-btn :icon="mdiRotate3dVariant" style="margin-inline: 8px"></v-btn>
  </div>
</template>

<style scoped></style>
