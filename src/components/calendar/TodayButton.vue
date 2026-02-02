<template>
  <v-btn
    outlined
    data-cy="calendar-today"
    @click="$emit('update:modelValue', new Date())"
  >
    {{ $t("calendar.today") }}
  </v-btn>
</template>

<script>
export default {
  name: "TodayButton",
  emits: ["update:modelValue"]
};
</script>
