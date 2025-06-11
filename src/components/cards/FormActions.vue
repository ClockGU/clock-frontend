<template>
  <v-card-actions>
    <v-btn
      variant="text"
      :loading="isSaving"
      :disabled="disableSave"
      color="primary"
      @click="save"
    >
      {{ $t("actions.save") }}
    </v-btn>
    <v-btn
      v-if="!disableCancle"
      :disabled="isSaving"
      data-cy="entity-cancel"
      variant="text"
      @click="close"
    >
      {{ $t("actions.cancel") }}
    </v-btn>
    <v-spacer></v-spacer>
    <ModelDeleteConfirmationDialog
      v-if="!isNewInstance"
      :delete-fn="destroy"
      :model-name="modelName"
    ></ModelDeleteConfirmationDialog>
  </v-card-actions>
</template>

<script>
import ModelDeleteConfirmationDialog from "@/components/cards/ModelDeleteConfirmationDialog.vue";

export default {
  name: "FormActions",
  components: { ModelDeleteConfirmationDialog },
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
    saving: {
      type: Boolean,
      default: false
    },
    modelName: {
      type: String,
      required: true
    }
  },
  emits: ["close"],
  data() {
    return { isSaving: this.saving };
  },
  watch: {
    saving(value) {
      this.isSaving = value;
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
