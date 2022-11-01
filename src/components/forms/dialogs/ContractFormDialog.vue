<template>
  <TheDialog
    :value="show"
    :fullscreen="$vuetify.breakpoint.smAndDown"
    :max-width="600"
    :persistent="false"
    @close="$emit('close')"
  >
    <template #activator="{ on }">
      <v-btn
        v-if="!icon && !disableActivator"
        :disabled="disabled"
        :color="btnColor"
        :text="textButton"
        v-on="on"
      >
        {{ buttonText }}
      </v-btn>
      <v-btn
        v-if="icon && !disableActivator"
        :disabled="disabled"
        :color="btnColor"
        icon
        v-on="on"
      >
        <v-icon>{{ create ? icons.mdiPlus : icons.mdiPencil }}</v-icon>
      </v-btn>
    </template>
    <template #content="{ events: { close } }">
      <ContractForm :existing-contract="contract" :close="close"></ContractForm>
    </template>
  </TheDialog>
</template>

<script>
import TheDialog from "@/components/TheDialog";
import { Contract } from "@/models/ContractModel";
import ContractForm from "@/components/forms/modelFroms/contract/ContractForm";
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
      show: this.value
    };
  },
  computed: {
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
