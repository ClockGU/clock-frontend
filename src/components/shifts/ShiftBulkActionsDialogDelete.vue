<template>
  <ConfirmationDialog @confirm="$emit('destroy')">
    <template #activator="{ on }">
      <slot name="activator" :on="on"></slot>
    </template>

    <template #title>
      {{ $t("buttons.deleteEntity", { entity: $tc("models.shift", count) }) }}
    </template>

    <template #text>
      {{
        $t("dialogs.textConfirmDelete", {
          selectedEntity: $tc("models.selectedShift", count)
        })
      }}
    </template>
  </ConfirmationDialog>
</template>

<script>
import ConfirmationDialog from "@/components/ConfirmationDialog";

import { mdiDelete } from "@mdi/js";

export default {
  name: "ShiftBulkActionsDialogDelete",
  components: { ConfirmationDialog },
  props: {
    count: { type: Number, default: 1 }
  },
  data: () => ({
    icons: { mdiDelete }
  })
};
</script>
