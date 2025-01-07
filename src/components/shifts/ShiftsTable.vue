<template>
  <div>
    <slot name="head" :selected="selected" :reset="reset"></slot>
    <v-data-table
      v-model="selected"
      :show-select="!isMobile"
      :headers="flexHeaders"
      :items="shifts"
      :search="search"
      :loading="loading"
      item-key="id"
      return-object
      hover
      :custom-sort="sortByDate"
      must-sort
      :sort-desc="!pastShifts"
    >
      <template #item="{ item }">
        <tr
          :class="{ 'selected-row': selected.includes(item) }"
          @click="handleClick(item)"
        >
          <td v-if="!isMobile">
            <v-checkbox-btn
              class="table-checkbox-btn"
              v-model="selected"
              :value="item"
            />
          </td>
          <td>
            {{
              isXs
                ? formattedDateMobile(item.started)
                : formattedDate(item.started)
            }}
          </td>
          <td>{{ formattedTime(item.started) }}</td>
          <td>{{ formattedDuration(item.duration) }}</td>
          <td>
            <div v-if="isXs">
              <v-icon :color="colors[item.type]" style="position: relative">
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

              <div
                style="
                  position: absolute;
                  top: 10px;
                  right: 0;
                  left: 18px;
                  bottom: 0;
                "
              >
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
              </div>
            </div>
            <div v-else>
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
            </div>
          </td>
          <td v-if="pastShifts" class="d-none d-sm-table-cell">
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
          <td class="d-none d-sm-table-cell">
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
          <td class="d-none d-sm-table-cell">
            <ShiftInfoDialog :item="item">
              <template #activator="{ props }">
                <span v-bind="props">{{ noteDisplay(item.note, 15) }}</span>
              </template>
            </ShiftInfoDialog>
          </td>
          <td class="d-none d-sm-table-cell">
            <ShiftFormDialog
              :create="false"
              icon
              :shift="item"
            ></ShiftFormDialog>
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<!-- Commented out, pending due to missing Userfeedback.       -->
<!--ShiftAssignContractDialog :shifts="[item]" @reset="$emit('refresh')">
          <template #activator="{ on }">
            <v-btn icon v-on="on">
              <v-icon>{{ icons.mdiSwapHorizontal }}</v-icon>
            </v-btn>
          </template>
        </ShiftAssignContractDialog-->

<!--ConfirmationDialog @confirm="destroySingleShift(item)">
          <template #activator="{ on }">
            <v-scale-transition>
              <v-btn elevation="1" icon v-on="on">
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
        </ConfirmationDialog-->

<script>
//import ConfirmationDialog from "@/components/ConfirmationDialog";
//import ShiftAssignContractDialog from "@/components/shifts/ShiftAssignContractDialog";
import ShiftInfoDialog from "@/components/shifts/ShiftInfoDialog.vue";
import { ShiftService } from "@/services/models";
import ShiftUtilityMixin from "@/mixins/ShiftUtilityMixin";
import ShiftFormDialog from "@/components/forms/dialogs/ShiftFormDialog.vue";
import breakpointsMixin from "@/mixins/breakpointsMixin";
import { localizedFormat } from "@/utils/date";

export default {
  name: "ShiftsTable",
  components: {
    ShiftFormDialog,
    //ConfirmationDialog,
    //  ShiftAssignContractDialog,
    ShiftInfoDialog
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
    },
    pastShifts: { type: Boolean, default: false }
  },
  emits: ["refresh"],
  mixins: [ShiftUtilityMixin, breakpointsMixin],

  data: () => ({
    selected: []
  }),
  computed: {
    flexHeaders() {
      const tagsAndNotesExist = this.shifts.some(
        (shift) => shift.tags.length > 0 || shift.note.length > 0
      );

      let filteredHeaders = [...this.headers];

      if (this.isXs && this.isMobile) {
        filteredHeaders = filteredHeaders.filter((item) => {
          const title = item.title;
          return (
            title !== this.$t("time.reviewed") &&
            title !== "Tags" &&
            title !== "Notes" &&
            title !== undefined
          );
        });
      }

      if (!tagsAndNotesExist) {
        filteredHeaders = filteredHeaders.filter(
          (item) => item.value !== "tagsNotes"
        );
      }
      return filteredHeaders;
    }
  },

  methods: {
    formattedDateMobile(date) {
      return this.$i18n.locale === "en"
        ? localizedFormat(date, "EEE',' do")
        : localizedFormat(date, "EEE ' ' do");
    },
    handleClick(shift) {
      const index = this.selected.indexOf(shift);

      if (index > -1) {
        this.selected.splice(index, 1);
      } else {
        this.selected.push(shift);
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
<style>
.selected-row {
  background-color: rgba(0, 0, 0, 0.1);
}
.table-checkbox-btn {
  right: 8px;
}
</style>
