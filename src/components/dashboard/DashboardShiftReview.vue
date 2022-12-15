<template>
  <v-card>
    <v-card-title>
      {{ $t("dashboard.reviewShifts") }}
    </v-card-title>
    <v-card-text>
      <div v-if="shiftsToReview.length > 0">
        <v-list>
          <div v-for="shift in shiftsToReview" :key="shift.id">
            <ShiftListItem :editable="true" :shift="shift">
              <template #actions>
                <v-list-item-action>
                  <ShiftFormDialog icon :shift="shift"></ShiftFormDialog>
                </v-list-item-action>
                <v-list-item-action>
                  <v-btn icon>
                    <v-icon> {{ icons.mdiCheck }}</v-icon>
                  </v-btn>
                </v-list-item-action>
                <v-list-item-action-text> Review </v-list-item-action-text>
              </template>
            </ShiftListItem>
          </div>
        </v-list>
      </div>
      <v-container v-else>
        {{ $t("dashboard.noReviewableShifts") }}
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import ShiftListItem from "@/components/shifts/ShiftListItem";
import ShiftFormDialog from "@/components/forms/dialogs/ShiftFormDialog";
import { mdiCheck } from "@mdi/js";

export default {
  name: "DashboardShiftReview",
  components: { ShiftFormDialog, ShiftListItem },
  data() {
    return {
      icons: {
        mdiCheck
      }
    };
  },
  computed: {
    shiftsToReview() {
      return this.$store.getters["contentData/selectedShifts"]
        .filter((shift) => !shift.wasReviewed)
        .slice(0, 5);
    }
  }
};
</script>

<style scoped></style>
