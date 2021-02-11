<template>
  <v-menu offset-y :close-on-click="true" :close-on-content-click="true">
    <template #activator="{ on, attrs }">
      <v-btn color="primary" text v-bind="attrs" v-on="on">
        {{ $t("actions.actions") }}
      </v-btn>
    </template>
    <v-list>
      <v-list-item
        v-if="shifts.length < 2"
        @click="$emit('edit', shifts[0].shift)"
      >
        <v-list-item-title>{{ $t("actions.edit") }}</v-list-item-title>
      </v-list-item>

      <ShiftBulkActionsDialogReview
        v-if="canReview"
        :shifts="shifts"
        @reset="$emit('refresh')"
      >
        <template #activator="{ on }">
          <v-list-item v-on="on">
            <v-list-item-title>{{ $t("actions.review") }}</v-list-item-title>
          </v-list-item>
        </template>
      </ShiftBulkActionsDialogReview>

      <ShiftBulkActionsDialogAssignContract
        :shifts="shifts"
        @reset="$emit('refresh')"
      >
        <template #activator="{ on, attrs }">
          <v-list-item v-bind="attrs" v-on="on">
            <v-list-item-title>
              {{ $t("shifts.assignContract") }}
            </v-list-item-title>
          </v-list-item>
        </template>
      </ShiftBulkActionsDialogAssignContract>

      <ShiftBulkActionsDialogDelete @destroy="destroyFn">
        <template #activator="{ on }">
          <v-list-item v-on="on">
            <v-list-item-title>{{ $t("actions.delete") }}</v-list-item-title>
          </v-list-item>
        </template>
      </ShiftBulkActionsDialogDelete>
    </v-list>
  </v-menu>
</template>

<script>
import ShiftBulkActionsDialogAssignContract from "@/components/ShiftBulkActionsDialogAssignContract";
import ShiftBulkActionsDialogDelete from "@/components/ShiftBulkActionsDialogDelete";
import ShiftBulkActionsDialogReview from "@/components/ShiftBulkActionsDialogReview";

export default {
  name: "ShiftBulkActions",
  components: {
    ShiftBulkActionsDialogAssignContract,
    ShiftBulkActionsDialogDelete,
    ShiftBulkActionsDialogReview
  },
  props: {
    // We need to pass a destroy function, because we cannot reset the
    // `this.selected` in `ShiftsTable.vue` otherwise.
    destroyFn: {
      type: Function,
      required: true
    },
    canReview: {
      type: Boolean,
      default: false
    },
    shifts: {
      type: Array,
      required: true
    }
  }
};
</script>
