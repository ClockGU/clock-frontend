<template>
  <div >
    <slot name="head" :selected="selectedShifts" :reset="reset"></slot>
    <v-data-table
      v-model="selectedShifts"
      :show-select="!mobile"  
      :headers="flexHeaders"
      :items="shifts"
      :search="search"
      :loading="loading"
      item-key="id"
      return-object
      hover
      :custom-sort="sortByDate"
      must-sort
      tabindex="0"
      :sort-desc="!pastShifts"
      :aria-label="$t('aria.shiftsTable.description')"
    >
      <template #item="{ item }">
        <tr
          :class="{ 'selected-row': selectedShifts.includes(item) }"
          tabindex="0"
          role="row"
          @click="handleClick(item)"
          @keydown.enter.stop="handleClick(item)"
          @keydown.space.stop="handleClick(item)"
        >
          <td v-if="!mobile">
            <v-checkbox-btn 
              v-model="selectedShifts"
              class="table-checkbox-btn"
              :value="item"
            />
          </td>
          <td>
            <div v-if="xs" class="d-flex align-center">
              <span>{{ formattedDateMobile(item.started) }}</span>
              <v-btn
                v-if="!item.wasReviewed"
                :icon="icons.mdiClose"
                :disabled="isRunningShift(item)"
                color="red"
                variant="outline"
                elevation="0"
                @click.stop="handleShiftReview(item)"
              ></v-btn>
              <v-btn
                v-else
                v                variant="text"
ariant="text"
                :icon="icons.mdiCheck"
                color="green"
                elevation="0"
              ></v-btn>
            </div>
            <span v-else> {{ formattedDate(item.started) }}</span>
          </td>
          <td>{{ formattedTime(item.started) }}</td>
          <td>
            <span>{{ formattedDuration(item.duration) }}</span>
            <ShiftWarningIcon
              v-if="xs"
              :shift="item"
              style="transform: translate(-35%, -35%)"
            >
            </ShiftWarningIcon>
          </td>
          <td :aria-label="$t(`aria.shift.${item.type}`)">   
            <v-icon 
            :color="colors[item.type]"  
            >
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
          <td class="d-none d-sm-table-cell">
            <v-btn
              v-if="!item.wasReviewed"
              :icon="icons.mdiClose"
              :disabled="isRunningShift(item)"
              color="red"
              variant="text"
              elevation="0"
              @click.stop="handleShiftReview(item)"
              @keydown.enter.stop="handleShiftReview(item)"
              @keydown.space.stop="handleShiftReview(item)"
              :aria-label="$t('aria.shiftsTable.notReviewed')"
            ></v-btn> 
            <v-btn
              v-else
              variant="text"
              :icon="icons.mdiCheck"
              color="green"
              elevation="0"
              tabindex="-1"
              :aria-label="$t('aria.shiftsTable.reviewed')"

            ></v-btn>
          </td>
          <td class="d-none d-sm-table-cell" aria-hidden="true">
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
          <td class="d-none d-sm-table-cell" 
          :aria-label="$t('aria.shiftsTable.editShift')">
            <ShiftFormDialog
              :create="false"
              icon
              :shift="item"
            ></ShiftFormDialog>
          </td>
        </tr> 
      </template>
    </v-data-table>
    <slot name="bottom" :selected="selectedShifts" :reset="reset"></slot>
  </div>
</template>

<!-- Commented out, pending due to missing Userfeedback.       -->
<!--ShiftAssignContractDialog :shifts="[item]" @reset="$emit('refresh')">
          <template #activator="{ on }">
            <v-btn icon v-on="on">
              <v-icon>{{ icons.mdiSwapHorizontal }}</v-icon>
            </v-btn>
          </template>s
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
import ShiftWarningIcon from "@/components/shifts/ShiftWarningIcon.vue";

export default {
  name: "ShiftsTable",
  components: {
    ShiftFormDialog,
    //ConfirmationDialog,
    //  ShiftAssignContractDialog,
    ShiftInfoDialog,
    ShiftWarningIcon
  },
  mixins: [ShiftUtilityMixin, breakpointsMixin],
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
  computed: {
    selectedShifts: {
      get() {
        return this.pastShifts
          ? this.$store.getters["selectedShifts/selectedPastShifts"]
          : this.$store.getters["selectedShifts/selectedFutureShifts"];
      },
      set(value) {
        this.$store.commit("selectedShifts/setSelectedShifts", {
          shifts: value,
          isPastShift: this.pastShifts
        });
      }
    },
    flexHeaders() {
      const tagsAndNotesExist = this.shifts.some(
        (shift) => shift.tags.length > 0 || shift.note.length > 0
      );

      let filteredHeaders = [...this.headers];

      if (this.xs && this.mobile) {
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
    isShiftSelected(shift) {
      return this.selectedShifts.findIndex((s) => s.id === shift.id) !== -1;
    },
    handleClick(shift) {
      const isPastShift = this.pastShifts;
      if (this.isShiftSelected(shift)) {
        this.$store.dispatch("selectedShifts/deselectShift", {
          shift,
          isPastShift
        });
      } else {
        this.$store.dispatch("selectedShifts/selectShift", {
          shift,
          isPastShift
        });
      }
    },
    handleShiftReview(shift) {
      this.reviewSingleShift(shift);
      if (this.isShiftSelected(shift))
        this.$store.dispatch("selectedShifts/deselectShift", {
          shift,
          isPastShift: this.pastShifts
        });
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
      this.$store.dispatch("selectedShifts/clearSelectedShifts");
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




