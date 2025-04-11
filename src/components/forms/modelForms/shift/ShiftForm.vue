<template>
  <v-card class="mx-auto word-break" min-width="400" :max-width="600">
    <CardToolbar
      :title="title"
      :logout-action="false"
      close-action
      @close="closeFn"
    ></CardToolbar>
    <ShiftFormFields
      v-model="shift"
      :alert-messages="messages"
      :alert-type="errorMessages.length > 0 ? 'error' : 'warning'"
      @schedule-shifts="setScheduledShifts($event)"
    ></ShiftFormFields>
    <FormActions
      :create-fn="saveShift"
      :delete-fn="deleteShift"
      :close-fn="closeFn"
      :update-fn="updateShift"
      :disable-save="!valid"
      :is-new-instance="isNewInstance"
      model-name="shift"
    ></FormActions>
  </v-card>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useStore } from "vuex";
//import { useVuelidate } from '@vuelidate/core';
//import { required, minLength } from '@vuelidate/validators';
import { useI18n } from "vue-i18n";
import { useShiftValidation } from "@/composable/useShiftValidation";
import { Shift } from "@/models/ShiftModel";
import FormActions from "@/components/cards/FormActions.vue";
import CardToolbar from "@/components/cards/CardToolbar.vue";
import ShiftFormFields from "@/components/forms/modelForms/shift/ShiftFormFields.vue";

const props = defineProps({
  initialDate: {
    type: Date,
    required: false,
    default: () => new Date()
  },
  initialContract: {
    type: String,
    required: false,
    default: ""
  },
  close: {
    type: Function,
    required: false,
    default: () => {}
  },
  showErrors: {
    type: Boolean,
    required: false,
    default: false
  }
});

const emit = defineEmits(["delete", "update", "close", "save"]);

const store = useStore();
const { t } = useI18n();

const scheduledShifts = ref([]);
const saving = ref(false);
const closed = ref(false);
const shift = defineModel({ type: Shift, default: () => new Shift() });
const { errorMessages, alertMessages, valid } = useShiftValidation(shift.value);

watch(
  () => props.showErrors,
  (opened) => {
    closed.value = !opened;
  }
);

const selectedContract = computed(
  () => store.getters["selectedContract/selectedContract"]
);

const title = computed(() => {
  return shift.value.id
    ? t("forms.titleUpdate", { entity: t("models.shift", 1) })
    : t("forms.titleAdd", { entity: t("models.shift", 1) });
});

const messages = computed(() =>
  saving.value || closed.value
    ? []
    : [...alertMessages.value, ...errorMessages.value]
);

const isNewInstance = computed(() => !shift.value.id);

const date = computed(() => {
  if (!shift.value.contract) {
    let dateValue;
    try {
      dateValue = new Date(selectedContract.value.startDate);
      dateValue.setHours(10, 0, 0);
    } catch {
      return props.initialDate;
    }
    return isBefore(props.initialDate, dateValue)
      ? dateValue
      : props.initialDate;
  }
  return props.initialDate;
});

async function saveShift() {
  saving.value = true;
  await store.dispatch("contentData/saveShift", shift.value.toPayload());
  if (Array.isArray(scheduledShifts.value) && scheduledShifts.value.length > 0)
    await store.dispatch("contentData/bulkCreateShifts", scheduledShifts.value);
  emit("save");
  closeFn();
  saving.value = false;
}

async function deleteShift() {
  await store.dispatch("contentData/deleteShift", shift.value);
  emit("delete");
  closeFn();
}

async function updateShift() {
  await store.dispatch("contentData/updateShift", {
    payload: shift.value.toPayload(),
    initialContract: props.initialContract
  });
  emit("update");
  closeFn();
}

function setScheduledShifts(event) {
  scheduledShifts.value = event;
}

function closeFn() {
  closed.value = true;
  //v$.$reset();
  props.close();
  emit("close");
}
</script>
