<template>
  <v-card flat>
    <v-card-title >
      <h3 class="text-h6 font-weight-bold">{{ $t("settings.snackbar.title") }}</h3>
    </v-card-title>
    <v-card-text>
      <span class="text-body">{{ $t("settings.snackbar.text") }}</span>
      <v-switch
        v-model="timeoutEnabled"
        :label="$t('settings.snackbar.enable')"
        :color="timeoutEnabled ? 'primary' : undefined"
      ></v-switch>

      <v-form ref="form">
        <label for="timeout-input" class="font-weight-bold">{{ $t("label.snackbarTimeout") }}</label>
        <v-text-field
          v-model="snackTime"
          id="timeout-input"
          :disabled="!timeoutEnabled"
          type="number"
          min="2000"
          max="10000"
          step="500"
          suffix="ms"
          variant="outlined"
          density="compact"
          :style="{maxWidth: '230px'}"
          :rules="timeRules"
        ></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" variant="text" @click="updateSettings">
        {{ $t("actions.save") }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import { max } from "date-fns";

const store = useStore();
const { t } = useI18n();

const form = ref(null);

const user = computed(() => store.getters.user || {});

// Local state for two-way binding with input fields
const timeoutEnabled = ref(user.value.timeout_enabled ?? true);
const snackTime = ref(user.value.snack_time || 5000);

watch(user, (newUser) => {
    timeoutEnabled.value = newUser.timeout_enabled ?? true;
    snackTime.value = newUser.snack_time || 5000;
}, { deep: true });

// Validation rules
const timeRules =  [
  (v) => !!v || t('validation.required_field'),
  (v) => v >= 2000 || t('validations.settings.snackbar.minValue'),
  (v) => v <= 10000 || t('validations.settings.snackbar.maxValue'),
  (v) => v % 500 === 0 || t('validations.settings.snackbar.multipleOf500'),
];

async function updateSettings() {
  if (form.value && !form.value.disabled) {
    const { valid } = await form.value.validate();
    if (!valid && timeoutEnabled.value) {
      return;
    }
  }

  let time = snackTime.value;
  let enabled = timeoutEnabled.value;
  
  // Ensure time is sent as a number and respects the bounds when enabled
  if (enabled) {
      time = parseInt(time);
      if (isNaN(time) || time < 2000 || time > 10000 || time % 500 !== 0) {
          time = 5000; 
      }
  } else {
      time = 5000;
  }

  const payload = { 
    snack_time: time, 
    timeout_enabled: enabled 
  };
  
  store.dispatch("UPDATE_SETTINGS", payload);
}
</script>