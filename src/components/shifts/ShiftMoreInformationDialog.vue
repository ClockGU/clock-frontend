<template>
  <TheDialog
    v-model="show"
    :fullscreen="smAndDown"
    :max-width="600"
    :persistent="false"
  >
    <template #activator="props">
      <slot name="activator" v-bind="props"></slot>
    </template>
    <template #content>
      <v-card flat height="100%">
        <CardToolbar
          :title="title"
          :logout-action="false"
          close-action
          @close="closeFn"
        ></CardToolbar>
        <br />

        <v-table comfortable rounded class="mt-8 mx-4">
          <tbody>
            <tr>
              <td class="font-weight-bold">{{ headers[0].title }}</td>
              <td>{{ formattedDate(item.started) }}</td>
            </tr>
            <tr>
              <td class="font-weight-bold">{{ headers[1].title }}</td>
              <td>{{ formattedTime(item.started) }}</td>
            </tr>
            <tr>
              <td class="font-weight-bold">{{ headers[2].title }}</td>
              <td>{{ formattedDuration(item.duration) }}</td>
            </tr>
            <tr>
              <td class="font-weight-bold">{{ headers[3].title }}</td>
              <td>
                <v-icon :color="colors[item.type]">
                  {{ typeIcons[item.type] }}
                </v-icon>
                <v-chip
                  v-if="isRunningShift(item)"
                  class="ml-2"
                  variant="outlined"
                  x-small
                  dense
                  color="red"
                >
                  live
                </v-chip>
              </td>
            </tr>
            <tr>
              <td class="font-weight-bold">{{ headers[4].title }}</td>
              <td>
                <v-btn
                  v-if="!item.wasReviewed"
                  :icon="icons.mdiClose"
                  :disabled="isRunningShift(item)"
                  color="red"
                  variant="text"
                  elevation="0"
                  @click="reviewSingleShift(item)"
                ></v-btn>
                <v-btn
                  v-else
                  variant="text"
                  :icon="icons.mdiCheck"
                  color="green"
                  elevation="0"
                ></v-btn>
              </td>
            </tr>
            <tr>
              <td class="font-weight-bold">Tags</td>
              <td>
                <v-chip
                  v-for="tag in item.tags.slice(0, 2)"
                  :key="tag"
                  class="mx-1"
                  small
                >
                  {{ tag }}
                </v-chip>
                <ShiftInfoDialog v-if="item.tags.length > 2" :item="item">
                  <template #activator="{ props }">
                    <v-chip small class="mx-1" v-bind="props">...</v-chip>
                  </template>
                </ShiftInfoDialog>
              </td>
            </tr>
            <tr>
              <td class="font-weight-bold">Notes</td>
              <td>
                <ShiftInfoDialog :item="item">
                  <template #activator="{ activatorProps }">
                    <span v-bind="activatorProps">{{
                      noteDisplay(item.note, 550)
                    }}</span>
                  </template>
                </ShiftInfoDialog>
              </td>
            </tr>
          </tbody>
        </v-table>
        <v-spacer></v-spacer>
        <div class="d-flex justify-center ga-4 my-8">
          <ShiftFormDialog
            :shift="item"
            disable-activator="true"
            @update="updateShift"
          >
            <template #activator="{ props }">
              <v-btn
                color="primary"
                class="py-2"
                size="large"
                variant="text"
                :prepend-icon="icons.mdiPencil"
                v-bind="props"
                >{{ $t("actions.edit") }}</v-btn
              >
            </template>
          </ShiftFormDialog>
          <ShiftBulkActionsDialogDelete @destroy="destroySingleShift(item)">
            <template #activator="{ props }">
              <v-btn
                color="red"
                class="py-2"
                size="large"
                variant="text"
                :prepend-icon="icons.mdiDelete"
                v-bind="props"
                >{{ $t("actions.delete") }}</v-btn
              >
            </template>
          </ShiftBulkActionsDialogDelete>
        </div>
      </v-card>
    </template>
  </TheDialog>
</template>

<script>
import ShiftBulkActionsDialogDelete from "@/components/shifts/ShiftBulkActionsDialogDelete.vue";
import TheDialog from "@/components/TheDialog.vue";
import ShiftInfoDialog from "@/components/shifts/ShiftInfoDialog.vue";
import ShiftFormDialog from "@/components/forms/dialogs/ShiftFormDialog.vue";
import CardToolbar from "@/components/cards/CardToolbar.vue";
import ShiftUtilityMixin from "@/mixins/ShiftUtilityMixin";
import breakpointsMixin from "@/mixins/breakpointsMixin";

export default {
  name: "ShiftMoreInformationDialog",
  components: {
    TheDialog,
    ShiftFormDialog,
    ShiftInfoDialog,
    ShiftBulkActionsDialogDelete,
    CardToolbar
  },
  props: {
    shift: {
      type: Object,
      required: false,
      default: undefined
    },
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: ["close", "update:modelValue", "reset"],
  mixins: [ShiftUtilityMixin, breakpointsMixin],
  data() {
    return {
      item: this.shift,
      show: this.modelValue,
      title: "View Shift Details"
    };
  },
  watch: {
    shift(newShift) {
      this.item = newShift;
    },
    modelValue(newValue) {
      this.show = newValue;
    }
  },
  methods: {
    async destroySingleShift(shift) {
      try {
        this.$store.commit("contentData/removeShift", {
          contractID: shift.contract,
          shiftInstance: shift
        });
        this.$emit("reset");
      } catch (error) {
        console.error(`Error deleting shift ${shift.id}`, error);
      }
    },
    closeFn() {
      this.show = false;
    },
    updateShift(updatedShift) {
      this.item = updatedShift;
      this.$emit("reset");
    }
  }
};
</script>
``
