<template>
  <v-menu offset-y :close-on-click="true" :close-on-content-click="true">
    <template #activator="{ on, attrs }">
      <v-btn text v-bind="attrs" v-on="on">{{ $t("actions.actions") }}</v-btn>
    </template>
    <v-list>
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

      <ShiftBulkActionsDialogDelete @destroy="destroy">
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

import ShiftService from "@/services/shift";
import { log } from "@/utils/log";

export default {
  name: "ShiftBulkActions",
  components: {
    ShiftBulkActionsDialogAssignContract,
    ShiftBulkActionsDialogDelete
  },
  props: {
    shifts: {
      type: Array,
      required: true
    }
  },
  methods: {
    async destroy() {
      const promises = [];

      try {
        for (const shift of this.shifts) {
          promises.push(ShiftService.delete(shift.uuid));
        }

        await Promise.all(promises);
      } catch (error) {
        // TODO: Set error state for component & allow user to reload page
        // We usually should end up here, if we are already logging out.
        // But a proper error state could mitigate further issues.
        log(error);
      } finally {
        this.$emit("refresh");
      }
    }
  }
};
</script>
