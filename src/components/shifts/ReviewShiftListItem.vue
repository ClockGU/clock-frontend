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
        <v-btn flat icon :disabled="!valid" @click="review">
          <v-icon
            :icon="icons.mdiCheck"
            color="success"
            :disabled="!valid"
            @click="review"
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
import { ref, watch, onMounted } from "vue";
import { useStore } from "vuex";
import { useShiftValidation } from "@/composable/useShiftValidation";
import ShiftListItem from "@/components/shifts/ShiftListItem.vue";
import ShiftFormDialog from "@/components/forms/dialogs/ShiftFormDialog.vue";
import { mdiCheck } from "@mdi/js";
import { Shift } from "@/models/ShiftModel";

const props = defineProps({
  shift: {
    type: Shift,
    required: true
  }
});

const icons = {
  mdiCheck
};
const newShift = ref(props.shift);

const store = useStore();
const { valid } = useShiftValidation(newShift.value);

watch(
  () => props.shift,
  (val) => {
    newShift.value = val;
  }
);

onMounted(() => {
  newShift.value = props.shift;
});

const review = async () => {
  newShift.value.wasReviewed = true;
  try {
    await store.dispatch("contentData/updateShift", {
      payload: newShift.value.toPayload(),
      initialContract: newShift.value.contract
    });
  } catch (e) {
    newShift.value.wasReviewed = false;
    throw new Error(e);
  } finally {
    await store.dispatch("contentData/refreshReports", {
      startDate: newShift.value.started,
      contractID: newShift.value.contract
    });
  }
};
</script>
