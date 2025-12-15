<template>
  <ShiftFormDialog
    :create="false"
    :shift="shift"
    disable-activator="true"
    @reset="$emit('reset')"
    @update="$emit('update', shift.contract)"
  >
    <template #activator="{ props }">
      <v-btn
        variant="flat"
        v-bind="props"
        :disabled="disabled"
        :icon="icons.mdiPencil"
        :aria-label="$t('aria.shiftBulkActions.edit')"
      >
        <v-icon>{{ icons.mdiPencil }}</v-icon>
        <ShiftWarningIcon
          v-if="showWarningIcon"
          style="transform: translate(-80%, -35%)"
          :shift="shift"
        ></ShiftWarningIcon>
      </v-btn>
    </template>
  </ShiftFormDialog>
</template>

<script>
import ShiftFormDialog from "@/components/forms/dialogs/ShiftFormDialog.vue";
import ShiftWarningIcon from "@/components/shifts/ShiftWarningIcon.vue";
import { mdiPencil } from "@mdi/js";

export default {
  name: "ShiftActionsDialogEdit",
  components: { ShiftFormDialog },
  props: {
    shift: {
      type: Object,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    showWarningIcon: {
      type: Boolean,
      default: false
    }
  },
  emits: ["reset", "update"],
  data: () => ({
    icons: { mdiPencil }
  })
};
</script>
