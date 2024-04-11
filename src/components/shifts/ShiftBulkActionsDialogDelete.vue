<template>
  <ConfirmationDialog
    :confirmation-button="{
      text: $t('actions.delete'),
      color: 'error'
    }"
    @confirm="destroy"
  >
    <template #activator="props">
      <slot name="activator" v-bind="props"></slot>
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
import ConfirmationDialog from "@/components/ConfirmationDialog.vue";

import { mdiDelete } from "@mdi/js";

export default {
  name: "ShiftBulkActionsDialogDelete",
  components: { ConfirmationDialog },
  props: {
    count: { type: Number, default: 1 }
  },
  emits: ["destroy"],
  data: () => ({
    icons: { mdiDelete }
  }),
  methods: {
    destroy() {
      this.$emit("destroy");
    }
  }
};
</script>
