<template>
  <v-menu
    ref="menuRef"
    v-model="menuOpen"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    location="bottom start"
  >
    <template #activator="{ props }">
      <label for="shift-date" class="ml-10">
        {{ $t("label.shiftFormDateInput") }}
      </label>
      <v-text-field
        id="shift-date"
        :model-value="formattedDate"
        readonly
        variant="filled"
        density="compact"
        hide-details
        :prepend-icon="icons.mdiCalendar"
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
        :model-value="date"
        no-title
        :allowed-dates="allowed"
        :min="min"
        :max="max"
        :first-day-of-week="1"
        :title="$t('label.dateInput.shift')"
        @update:model-value="onDateSelected"
      ></v-date-picker>
    </v-card>
  </v-menu>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { localizedFormat } from "@/utils/date";
import { mdiCalendar } from "@mdi/js";

// Props
const props = defineProps({
  modelValue: {
    type: Date,
    required: true
  },
  min: {
    type: String,
    default: ""
  },
  max: {
    type: String,
    default: ""
  },
  label: {
    type: String,
    default: ""
  }
});

// Emits
const emit = defineEmits(["update:modelValue"]);

// Refs
const menuRef = ref(null);
const menuOpen = ref(false);
const date = ref(props.modelValue);

// Icons
const icons = { mdiCalendar };

// Computed
const formattedDate = computed(() => {
  // Perhaps not ideal, but most users will be DE
  // TODO check date-fns documentation
  return localizedFormat(date.value, "eee, dd.MM.yyyy");
});

// Methods
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

const onDateSelected = (selectedDate) => {
  emit("update:modelValue", selectedDate);
  setTimeout(() => (menuOpen.value = false), 350);
};

const allowed = (value) => {
  // Commented out for including the UB
  // const parsedValue = parseISO(value);
  // return !isSunday(parsedValue);
  return true;
};

// Watchers
watch(
  () => props.modelValue,
  (val) => {
    date.value = val;
  }
);
</script>
