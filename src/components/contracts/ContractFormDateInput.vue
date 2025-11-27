<template>
  <v-menu
    ref="menuRef"
    v-model="menuOpen"
    :close-on-content-click="false"
    transition="scale-transition"
    min-width="290px"
    :nudge-right="40"
    :nudge-bottom="56"
    location="bottom start"
  >
    <template #activator="{ props }">
      <v-text-field
        :model-value="formattedDate"
        readonly
        variant="filled"
        :prepend-icon="icon"
        :disabled="disabled"
        :error="error"
        :label="label"
        v-bind="props"
        role="combobox"
        aria-haspopup="dialog"
        :aria-expanded="menuOpen"
        @keydown.enter.prevent="toggleMenu"
        @keydown.space.prevent="toggleMenu"
      ></v-text-field>
    </template>
    <v-card min-width="300">
      <v-date-picker
        v-model="date"
        :allowed-dates="type === 'start' ? allowedStartDates : allowedEndDates"
        :first-day-of-week="1"
        :max="max"
        :min="min"
        :title="$t('label.dateInput.contract')"
        @click:save="closeMenu"
        @click:cancel="closeMenu"
        @update:model-value="onDateSelected"
      ></v-date-picker>
    </v-card>
  </v-menu>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { isLastDayOfMonth, getDate } from "date-fns";
import { localizedFormat } from "@/utils/date";
import { mdiCalendarArrowLeft, mdiCalendarArrowRight } from "@mdi/js";

// Props
const props = defineProps({
  modelValue: {
    type: Date,
    required: true
  },
  label: {
    type: String,
    default: null
  },
  max: {
    type: String,
    default: null
  },
  min: {
    type: String,
    default: null
  },
  type: {
    type: String,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  error: {
    type: Boolean,
    default: false
  }
});

// Emits
const emit = defineEmits(["update:modelValue"]);

// Refs
const menuRef = ref(null);
const menuOpen = ref(false);
const date = ref(props.modelValue);

// Icons
const icons = {
  mdiCalendarArrowLeft,
  mdiCalendarArrowRight
};

// Computed
const icon = computed(() => {
  return props.type === "start"
    ? icons.mdiCalendarArrowRight
    : icons.mdiCalendarArrowLeft;
});

const formattedDate = computed(() => {
  return localizedFormat(props.modelValue, "eee do MMM yyyy");
});

// Methods
const toggleMenu = () => {
  if (!props.disabled) {
    menuOpen.value = !menuOpen.value;
  }
};

const closeMenu = () => {
  menuOpen.value = false;
};

const onDateSelected = () => {
  emit("update:modelValue", date.value);
  setTimeout(() => closeMenu(), 350);
};

const allowedStartDates = (val) => {
  const day = getDate(val);
  return day === 1 || day === 16;
};

const allowedEndDates = (val) => {
  const day = getDate(val);
  return day === 15 || isLastDayOfMonth(val);
};

// Watchers
watch(
  () => props.modelValue,
  (val) => {
    date.value = val;
  }
);
</script>
