<script setup>
import ConfirmationDialog from "@/components/ConfirmationDialog.vue";
import { computed } from "vue";
import { capitalizeFirstLetter } from "@/utils";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const props = defineProps({
  modelName: {
    type: String,
    required: true
  },
  deleteFn: {
    required: true,
    type: Function
  }
});

defineEmits(["close"]);

async function destroy() {
  await props.deleteFn();
}
const capitalizedModelName = computed(() =>
  capitalizeFirstLetter(props.modelName)
);
const consequencesText = computed(() => {
  if (props.modelName !== "contract") return "";
  return t("dialogs.contractDeleteConsequences");
});
</script>

<template>
  <ConfirmationDialog
    :confirmation-button="{ text: t('actions.delete'), color: 'error' }"
    @confirm="destroy"
    aria-labelledby="delete-confirmation-title"
  >
    <template #activator="{ props }">
      <v-btn 
        variant="text" 
        color="error" 
        v-bind="props"
        :aria-label="t('actions.delete')"
      >
        {{ t("actions.delete") }}
      </v-btn>
    </template>

    <template #title>
      <h2 id="delete-confirmation-title" class="text-h6 font-weight-bold">
        {{
          t("buttons.deleteEntity", {
            entity: t(`models.${modelName}`)
          })
        }}
      </h2>
    </template>
    <template #text>
      <p>
        {{
          t(`dialogs.textConfirmDelete`, {
            selectedEntity: t(`models.selected${capitalizedModelName}`)
          })
        }}
      </p>
    </template>
    <template #consequencesText>
      <p v-if="consequencesText">{{ consequencesText }}</p>
    </template>
  </ConfirmationDialog>
</template>