<script setup>

import ConfirmationDialog from "@/components/ConfirmationDialog.vue";
import { computed } from "vue";
import { capitalizeFirstLetter } from "@/utils";
import { useI18n } from "vue-i18n";
const { t } = useI18n()
const props = defineProps({modelName: {
  type: String,
    required: true
  },
  deleteFn: {
  required:true,
    type:Function
  }
})

defineEmits(["close"]);

async function destroy(){
  await props.deleteFn();
}
const capitalizedModelName = computed(()=> capitalizeFirstLetter(props.modelName))
const consequencesText = computed(()=> {
  if (props.modelName !== "contract") return "";
  return t("dialogs.contractDeleteConsequences");
})

</script>

<template>
  <ConfirmationDialog
    :confirmation-button="{ text: t('actions.delete'), color: 'error' }"
    @confirm="destroy"
  >
    <template #activator="{ props }">
      <v-btn
        variant="text"
        color="error"
        v-bind="props"
      >
        {{ t("actions.delete") }}
      </v-btn>
    </template>

    <template #title>
      {{
        t("buttons.deleteEntity", {
          entity: t(`models.${modelName}`)
        })
      }}
    </template>
    <template #text>
      {{
        t(`dialogs.textConfirmDelete`, {
          selectedEntity: t(`models.selected${capitalizedModelName}`)
        })
      }}
    </template>
    <template #consequencesText>
      {{ consequencesText }}
    </template>
  </ConfirmationDialog>
</template>

<style scoped>

</style>