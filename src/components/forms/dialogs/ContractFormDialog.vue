<template>
  <div>
    <TheDialog
      :value="show"
      :fullscreen="smAndDown"
      :max-width="600"
      :persistent="false"
      @close="$emit('close')"
      aria-labelledby="contract-form-title"
    >
      <template #activator="{ props }">
        <v-btn
          v-if="!icon && !disableActivator"
          :disabled="disabled"
          :color="btnColor"
          v-bind="props"
          @click="opened = true"
          :aria-label="create ? $t('actions.add') : $t('actions.edit')"
        >
          {{ buttonText }}
        </v-btn>
        <v-btn
          v-if="icon && !disableActivator"
          :disabled="disabled"
          :color="btnColor"
          :icon="create ? icons.mdiPlus : icons.mdiPencil"
          v-bind="props"
          :aria-label="create ? $t('actions.add') : $t('actions.edit')"
        >
        </v-btn>
      </template>
      <template #content="{ events: { close } }">
        <div role="dialog" aria-modal="true" aria-labelledby="contract-form-title">
          <h2 id="contract-form-title" class="sr-only">
            {{ create ? $t('actions.add') : $t('actions.edit') }}
          </h2>
          <ContractForm
            :existing-contract="contract"
            :close="close"
            :show-errors="opened"
            @close="opened = false"
          ></ContractForm>
        </div>
      </template>
    </TheDialog>
  </div>
</template>

<script>
import TheDialog from "@/components/TheDialog.vue";
import { Contract } from "@/models/ContractModel";
import ContractForm from "@/components/forms/modelForms/contract/ContractForm.vue";
import { mdiPencil, mdiPlus } from "@mdi/js";

export default {
  name: "ContractFormDialog",
  components: { ContractForm, TheDialog },
  props: {
    contract: {
      type: Contract,
      required: false,
      default: undefined
    },
    icon: {
      type: Boolean,
      default: false
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
    overrideButtonText: {
      type: String,
      default: ""
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  emits: ["close"],
  data() {
    return {
      icons: {
        mdiPencil,
        mdiPlus
      },
      show: this.value,
      opened: true
    };
  },
  computed: {
    smAndDown() {
      return this.$vuetify.display.smAndDown;
    },
    create() {
      return this.contract === undefined;
    },
    buttonText() {
      if (!this.textButton) {
        return this.create
          ? this.$t("buttons.newEntity", {
              entity: this.$tc("models.contract")
            })
          : this.$t("buttons.updateEntity", {
              entity: this.$tc("models.contract")
            });
      }
      if (this.overrideButtonText !== "") {
        return this.overrideButtonText;
      }
      return this.create ? this.$t("actions.add") : this.$t("actions.edit");
    }
  },
  watch: {
    value(val) {
      this.show = val;
    }
  }
};
</script>