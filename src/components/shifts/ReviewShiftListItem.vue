<template>
  <ShiftListItem
    :editable="true"
    :shift="shift"
    :error="!valid"
    hide-reviewed-chip
  >
    <template #actions>
      <v-list-item-action start end>
        <ShiftFormDialog icon :shift="shift"></ShiftFormDialog>
      </v-list-item-action>
      <v-list-item-action start>
        <v-btn
          flat
          icon
          :disabled="!valid"
          :aria-label="$t('aria.dashboard.reviewShift')"
          @click="review"
        >
          <v-icon
            :icon="icons.mdiCheck"
            color="success"
            :disabled="!valid"
          ></v-icon>
        </v-btn>
      </v-list-item-action>
      <v-list-item-action>
        {{ $t("shifts.review.review") }}
      </v-list-item-action>
    </template>
    <template #extraSubtitle>
      <v-list-item-subtitle v-if="!valid" class="text-error">
        {{ $t("shifts.review.unableToReview") }}
      </v-list-item-subtitle>
    </template>
  </ShiftListItem>
</template>

<script setup>
import { useStore } from "vuex";
import { useShiftValidation } from "@/composable/useShiftValidation";
import ShiftListItem from "@/components/shifts/ShiftListItem.vue";
import ShiftFormDialog from "@/components/forms/dialogs/ShiftFormDialog.vue";
import { mdiCheck } from "@mdi/js";
import { Shift } from "@/models/ShiftModel";

const icons = {
  mdiCheck
};
const shift = defineModel({ type: Shift, required: true });

const store = useStore();
const { valid } = useShiftValidation(shift);

const review = async () => {
  shift.value.wasReviewed = true;
  try {
    await store.dispatch("contentData/updateShift", {
      payload: shift.value.toPayload(),
      initialContract: shift.value.contract
    });
  } catch (e) {
    shift.value.wasReviewed = false;
    throw new Error(e);
  } finally {
    await store.dispatch("contentData/refreshReports", {
      startDate: shift.value.started,
      contractID: shift.value.contract
    });
  }
};
</script>
