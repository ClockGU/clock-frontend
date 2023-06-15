<template>
  <v-card-actions>
    <v-btn text :disabled="disableSave" color="primary" @click="save">
      {{ $t("actions.save") }}
    </v-btn>
    <v-btn v-if="!disableCancle" data-cy="entity-cancel" text @click="close">
      {{ $t("actions.cancel") }}
    </v-btn>
    <v-spacer></v-spacer>
    <ConfirmationDialog
      v-if="!isNewInstance"
      :confirmation-button="{ text: $t('actions.delete'), color: 'error' }"
      @confirm="destroy"
    >
      <template #activator="{ on }">
        <v-btn data-cy="entity-form-delete-button" text color="error" v-on="on">
          {{ $t("actions.delete") }}
        </v-btn>
      </template>

      <template #title>
        {{
          $t("buttons.deleteEntity", {
            entity: $tc(`models.${modelName}`)
          })
        }}
      </template>
      <template #text>
        {{
          $t(`dialogs.textConfirmDelete`, {
            selectedEntity: $tc(`models.selected${capitalizedModelName}`)
          })
        }}
      </template>
      <template #consequencesText>
        {{ consequencesText }}
      </template>
    </ConfirmationDialog>
  </v-card-actions>
</template>

<script>
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { capitalizeFirstLetter } from "@/utils";

export default {
  name: "FormActions",
  components: { ConfirmationDialog },
  props: {
    disableSave: {
      type: Boolean,
      required: true
    },
    disableCancle: {
      type: Boolean,
      default: false
    },
    isNewInstance: {
      type: Boolean,
      required: false,
      default: false
    },
    closeFn: {
      type: Function,
      required: true
    },
    createFn: {
      type: Function,
      required: true
    },
    updateFn: {
      type: Function,
      required: true
    },
    deleteFn: {
      type: Function,
      required: true
    },
    modelName: {
      type: String,
      required: true
    }
  },
  computed: {
    capitalizedModelName() {
      return capitalizeFirstLetter(this.modelName);
    },
    consequencesText() {
      if (this.modelName !== "contract") return "";
      return this.$t("dialogs.contractDeleteConsequences");
    }
  },
  methods: {
    async save() {
      if (this.isNewInstance) {
        await this.createFn();
      } else {
        await this.updateFn();
      }
    },
    async destroy() {
      await this.deleteFn();
    },
    close() {
      this.$emit("close");
      this.closeFn();
    }
  }
};
</script>

<style scoped></style>
