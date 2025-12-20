<template>
  <TheDialog
    v-model="show"
    :fullscreen="xs"
    :max-width="600"
    :persistent="false"
    @close="closeFormDialog"
  >
    <template #activator="props">
      <slot name="activator" v-bind="props"></slot>
      <v-btn
        v-if="!icon && !disableActivator"
        :disabled="disabled"
        :color="btnColor"
        :flat="flatButton"
        v-bind="props['props']"
        :aria-label="
          create
            ? $t('aria.shiftsTable.createShift')
            : $t('aria.shiftsTable.editShift')
        "
        @click.stop
        @keydown.stop
      >
        {{ buttonText }}
      </v-btn>
      <div v-if="icon && !disableActivator">
        <v-btn
          :disabled="disabled"
          variant="flat"
          :color="btnColor"
          :flat="flatButton"
          :icon="create ? icons.mdiPlus : icons.mdiPencil"
          :aria-label="$t('aria.shiftsTable.editShift')"
          v-bind="props['props']"
          @click.stop
          @keydown.stop
        >
        </v-btn>
        <ShiftWarningIcon v-if="showWarningIcon" :shift="newShift"> </ShiftWarningIcon>
      </div>
    </template>
    <template #content="{ events: { close } }">
      <ShiftForm
        v-model="newShift"
        :initial-date="date"
        :close="close"
        :show-errors="show"
        :initial-contract="initialContract"
        @save="$emit('save')"
        @delete="$emit('delete')"
        @update="$emit('update')"
        @close="closeFormDialog"
      ></ShiftForm>
    </template>
  </TheDialog>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useStore } from "vuex";
import { isBefore } from "date-fns";
import { Shift } from "@/models/ShiftModel";
import { mdiExclamation, mdiPencil, mdiPlus } from "@mdi/js";
import { useI18n } from "vue-i18n";
import { useDisplay } from "vuetify/lib/framework.mjs";
import TheDialog from "@/components/TheDialog.vue";
import ShiftForm from "@/components/forms/modelForms/shift/ShiftForm.vue";
import ShiftWarningIcon from "@/components/shifts/ShiftWarningIcon.vue";
// Props
const props = defineProps({
  shift: {
    type: Shift,
    required: false,
    default: undefined
  },
  initialDate: {
    type: Date,
    required: false,
    default: () => new Date()
  },
  icon: {
    type: Boolean,
    default: false
  },
  showWarningIcon: {
    type: Boolean,
    default: true
  },
  btnColor: {
    type: String,
    default: ""
  },
  disabled: {
    type: Boolean,
    default: false
  },
  disableActivator: {
    type: Boolean,
    default: false
  },
  textButton: {
    type: Boolean,
    default: false
  },
  flatButton: {
    type: Boolean,
    default: false
  }
});

// Emits
const emit = defineEmits(["close", "save", "update", "delete", "reset"]);

// State
const icons = { mdiPencil, mdiPlus, mdiExclamation };
const show = defineModel({ type: Boolean });
const newShift = ref(props.shift);
const initialContract = ref("");

const store = useStore();
const { t } = useI18n();
const { xs } = useDisplay();

// Computed
const create = computed(() => props.shift === undefined);

const buttonText = computed(() => {
  if (!props.textButton) {
    return create.value
      ? t("buttons.newEntity", { entity: t("models.shift") })
      : t("buttons.updateEntity", { entity: t("models.shift") });
  }
  return create.value ? t("buttons.add") : t("actions.edit");
});

const date = computed(() => {
  if (create.value) {
    let date;
    try {
      date = store.getters["selectedContract/selectedContract"].startDate;
      date.setHours(10, 0, 0);
    } catch {
      return props.initialDate;
    }
    if (isBefore(props.initialDate, date)) {
      return date;
    }
  }
  return props.initialDate;
});

// Watchers
watch(show, (val) => {
  if (val) {
    initializeNewShift();
  }
});

// Methods
function initializeNewShift() {
  let date = props.initialDate;
  if (create.value) {
    const contractStartDate =
      store.getters["selectedContract/selectedContract"].startDate;

    if (isBefore(props.initialDate, contractStartDate)) {
      date = contractStartDate;
    }
  }
  let started = new Date(date);
  started.setHours(10, 0, 0, 0);
  let stopped = new Date(date);
  stopped.setHours(10, 30, 0, 0);
  newShift.value = !create.value
    ? props.shift.clone()
    : new Shift({ started: started, stopped: stopped });
  initialContract.value = newShift.value.contract;
}

function closeFormDialog() {
  emit("close");
  emit("reset");
  show.value = false;
}
</script>
