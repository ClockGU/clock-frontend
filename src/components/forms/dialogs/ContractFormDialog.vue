<template>
  <div>
    <TheDialog
      :value="show"
      :fullscreen="smAndDown"
      :max-width="600"
      :persistent="false"
      @close="$emit('close')"
    >
      <template #activator="props">
        <v-btn
          v-if="!icon && !disableActivator"
          :disabled="disabled"
          :color="btnColor"
          :variant="textButton && 'text'"
          v-bind="props"
          @click="opened = true"
        >
          {{ buttonText }}
        </v-btn>
        <v-btn
          v-if="icon && !disableActivator"
          :disabled="disabled"
          :color="btnColor"
          icon
          v-bind="props"
        >
          <v-icon>{{ create ? icons.mdiPlus : icons.mdiPencil }}</v-icon>
        </v-btn>
      </template>
      <template #content="{ events: { close } }">
        <ContractForm
          :existing-contract="contract"
          :close="close"
          :show-errors="opened"
          @close="opened = false"
        ></ContractForm>
      </template>
    </TheDialog>
  </div>
</template>

<script>
import TheDialog from "@/components/TheDialog.vue";
import { Contract } from "@/models/ContractModel";
import ContractForm from "@/components/forms/modelForms/contract/ContractForm.vue";
import { mdiPencil, mdiPlus } from "@mdi/js";
import { useDisplay } from "vuetify";

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
    value: {
      type: Boolean,
      default: false
    }
  },
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
      const { smAndDown } = useDisplay();
      return smAndDown;
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
      return this.create ? this.$t("buttons.add") : this.$t("actions.edit");
    }
  },
  watch: {
    value(val) {
      this.show = val;
    }
  }
};
</script>

<style scoped></style>
