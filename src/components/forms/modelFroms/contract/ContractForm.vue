<template>
  <v-card class="mx-auto word-break" min-width="400" :max-width="600">
    <CardToolbar
      :title="title"
      :logout-action="false"
      close-action
      @close="closeFn"
    ></CardToolbar>
    <ContractFormFields v-model="newContract"></ContractFormFields>
    <span>{{ v$.$errors }}</span>
    <FormActions
      :create-fn="saveContract"
      :delete-fn="deleteContract"
      :close-fn="closeFn"
      :update-fn="updateContract"
      :disable-save="false"
      :is-new-instance="isNewInstance"
      model-name="contract"
    >
    </FormActions>
  </v-card>
</template>

<script>
import { Contract } from "@/models/ContractModel";
import CardToolbar from "@/components/cards/CardToolbar";
import FormActions from "@/components/cards/FormActions";
import ContractFormFields from "@/components/forms/modelFroms/contract/ContractFormFields";
import { ContractService } from "@/services/models";
import { useVuelidate } from "@vuelidate/core";

export default {
  name: "ContractForm",
  components: { ContractFormFields, FormActions, CardToolbar },
  props: {
    existingContract: {
      type: [Contract, typeof undefined],
      required: false,
      default: undefined
    },
    close: {
      type: Function,
      required: false,
      default: () => {}
    }
  },
  setup() {
    return {
      v$: useVuelidate()
    };
  },
  data() {
    return {
      newContract: undefined
    };
  },
  computed: {
    isNewInstance() {
      return this.newContract.id === "";
    },
    title() {
      if (this.isNewInstance) {
        return this.$t("forms.titleAdd", {
          entity: this.$tc("models.contract", 1)
        });
      }
      return this.$t("forms.titleUpdate", {
        entity: this.$tc("models.contract", 1)
      });
    }
  },
  created() {
    this.initializeNewContract();
  },
  methods: {
    async saveContract() {
      const savedContract = await ContractService.create(
        this.newContract.toPayload()
      );
      this.$store.commit("contentData/addContract", {
        contractInstance: savedContract
      });
      this.closeFn();
    },
    deleteContract() {
      this.closeFn();
    },
    updateContract() {
      this.close();
    },
    initializeNewContract() {
      this.newContract =
        this.existingContract !== undefined
          ? this.existingContract.clone()
          : new Contract();
    },
    closeFn() {
      this.v$.$reset();
      this.initializeNewContract();
      this.close();
    }
  }
};
</script>

<style scoped></style>
