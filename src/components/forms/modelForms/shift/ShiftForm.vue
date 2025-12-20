<template>
  <v-card
    class="mx-auto word-break"
    min-width="400"
    :max-width="600"
    :aria-label="title"
  >
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
      :saving="saving"
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
import { useI18n } from "vue-i18n";
import { useShiftValidation } from "@/composable/useShiftValidation";
import { Shift } from "@/models/ShiftModel";
import FormActions from "@/components/cards/FormActions.vue";
import CardToolbar from "@/components/cards/CardToolbar.vue";
import ShiftFormFields from "@/components/forms/modelForms/shift/ShiftFormFields.vue";
import { localizedFormat } from "@/utils/date";

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
// Keep a copy of the original shift to compare with the modified one
const originalShift = ref(shift.value.clone());
const { errorMessages, alertMessages, valid } = useShiftValidation(shift);

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

watch(
  () => props.showErrors,
  (opened) => {
    closed.value = !opened;
  }
);
watch(shift, (newShift) => {
  originalShift.value = newShift.clone();
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
  const changedFields = getChangedFields(originalShift.value, shift.value);
  //changedFields will always have an id as it is needed to update the shift
  if (Object.keys(changedFields).length === 1) return;

  const payload = mapChangedFieldsToApi(changedFields);
  await store.dispatch("contentData/updateShift", {
    payload: payload,
    initialContract: props.initialContract
  });
  emit("update");
  closeFn();
}
function getChangedFields(oldShift, newShift) {
  const changes = { id: oldShift.id };
  for (const key in newShift) {
    if (newShift.hasOwnProperty(key) && oldShift.hasOwnProperty(key)) {
      if (key === "createdAt" || key === "modifiedAt") {
        continue;
      }
      if (newShift[key] instanceof Date && oldShift[key] instanceof Date) {
        if (newShift[key].getTime() !== oldShift[key].getTime()) {
          changes[key] = newShift[key];
        }
      } else if (newShift[key] !== oldShift[key]) {
        changes[key] = newShift[key];
      }
    }
  }
  return changes;
}
function mapChangedFieldsToApi(changedFields) {
  const changedFieldsApi = {};
  for (const key in changedFields) {
    if (changedFields.hasOwnProperty(key) && changedFields[key] !== undefined) {
      switch (key) {
        case "started":
        case "stopped":
          changedFieldsApi[key] = localizedFormat(
            changedFields[key],
            "yyyy-MM-dd HH:mm:ssXXX",
            {
              locale: { localize: "en" }
            }
          );
          break;
        case "wasReviewed":
          changedFieldsApi.was_reviewed = changedFields[key];
          break;
        default:
          changedFieldsApi[key] = changedFields[key];
      }
    }
  }
  return changedFieldsApi;
}
function setScheduledShifts(event) {
  scheduledShifts.value = event;
}

function closeFn() {
  closed.value = true;
  props.close();
  emit("close");
}
</script>
