<template>
  <div>
    <slot name="head" :destroy-fn="destroy" :selected="selected"></slot>

    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="shifts"
      :search="search"
      :loading="loading"
      item-key="uuid"
      show-select
    >
      <!-- eslint-disable-next-line -->
      <template #item.reviewed="{ item }">
        <v-icon v-if="item.reviewed" color="green">
          {{ icons.mdiCheck }}
        </v-icon>

        <v-icon v-else color="red">
          {{ icons.mdiClose }}
        </v-icon>
      </template>

      <!-- eslint-disable-next-line -->
      <template v-slot:item.actions="{ item }">
        <v-btn text @click="$emit('edit', item.shift)">
          <v-icon>
            {{ icons.mdiPencil }}
          </v-icon>
        </v-btn>

        <ConfirmationDialog @confirm="destroySingleShift(item)">
          <template #activator="{ on }">
            <v-scale-transition>
              <v-btn text v-on="on">
                <v-icon>
                  {{ icons.mdiDelete }}
                </v-icon>
              </v-btn>
            </v-scale-transition>
          </template>

          <template #title>
            {{
              $t("buttons.deleteEntity", {
                entity: $tc("models.shift")
              })
            }}
          </template>

          <template #text>
            {{
              $t(`dialogs.textConfirmDelete`, {
                selectedEntity: $tc(`models.selectedShift`)
              })
            }}
          </template>
        </ConfirmationDialog>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import ConfirmationDialog from "@/components/ConfirmationDialog";

import { mdiCheck, mdiClose, mdiDelete, mdiPencil } from "@mdi/js";

import { SHIFT_TABLE_HEADERS } from "@/utils/misc";

import ShiftService from "@/services/shift";
import { log } from "@/utils/log";

export default {
  name: "ShiftsTable",
  components: {
    ConfirmationDialog
  },
  props: {
    loading: {
      type: Boolean,
      required: true
    },
    search: {
      type: String,
      default: ""
    },
    shifts: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    icons: { mdiCheck, mdiClose, mdiDelete, mdiPencil },
    headers: SHIFT_TABLE_HEADERS,
    selected: []
  }),
  methods: {
    async destroy() {
      const promises = [];
      try {
        for (const shift of this.selected) {
          promises.push(ShiftService.delete(shift.uuid));
        }

        await Promise.all(promises);

        this.$emit("refresh");
        this.reset();
      } catch (error) {
        // TODO: Set error state for component & allow user to reload page
        // We usually should end up here, if we are already logging out.
        // But a proper error state could mitigate further issues.
        log(error);
      }
    },
    async destroySingleShift(shift) {
      try {
        await ShiftService.delete(shift.uuid);

        this.$emit("refresh");
        this.reset();
      } catch (error) {
        // TODO: Set error state for component & allow user to reload page
        // We usually should end up here, if we are already logging out.
        // But a proper error state could mitigate further issues.
        log(error);
      }
    },
    reset() {
      this.selected = [];
    }
  }
};
</script>
