<template>
  <v-card
    :elevation="0"
    class="mx-auto word-break"
    min-width="400"
    :max-width="600"
  >
    <CardToolbar
      v-if="showToolbar"
      :title="title"
      :logout-action="false"
      :close-action="!disableCancel"
      @close="closeFn"
    ></CardToolbar>
    <ContractFormFields
      v-model="newContract"
      :alert-messages="messages"
      :alert-type="'error'"
    ></ContractFormFields>
    <FormActions
      :create-fn="saveContract"
      :delete-fn="deleteContract"
      :close-fn="closeFn"
      :update-fn="updateContract"
      :disable-save="!valid"
      :is-new-instance="isNewInstance"
      model-name="contract"
      :disable-cancle="disableCancel"
    >
    </FormActions>
  </v-card>
</template>

<script>
import { Contract } from "@/models/ContractModel";
import CardToolbar from "@/components/cards/CardToolbar.vue";
import FormActions from "@/components/cards/FormActions.vue";
import ContractFormFields from "@/components/forms/modelForms/contract/ContractFormFields.vue";
import { ContractService, ReportService } from "@/services/models";
import { useVuelidate } from "@vuelidate/core";
import ContractValidationMixin from "@/mixins/ContractValidationMixin";
import { format } from "date-fns";

export default {
  name: "ContractForm",
  components: { ContractFormFields, FormActions, CardToolbar },
  mixins: [ContractValidationMixin],
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
    },
    showToolbar: {
      type: Boolean,
      default: true
    },
    disableCancel: {
      type: Boolean,
      default: false
    },
    showErrors: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  setup() {
    return {
      v$: useVuelidate()
    };
  },
  data() {
    return {
      newContract: undefined,
      saving: false,
      closed: false
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
    },
    messages() {
      return this.saving || this.closed ? [] : this.errorMessages;
    }
  },
  watch: {
    existingContract() {
      this.initializeNewContract();
    },
    showErrors(opened) {
      this.closed = !opened;
    }
  },
  created() {
    this.initializeNewContract();
  },
  methods: {
    async saveContract() {
      this.saving = true;
      const savedContract = await ContractService.create(
        this.newContract.toPayload()
      );
      this.$store.commit("contentData/addContract", savedContract);
      await this.updateContractReports(savedContract);
      this.closeFn();
      this.saving = false;
    },
    async deleteContract() {
      await ContractService.delete(this.newContract.id);
      this.$store.commit("contentData/removeContract", {
        contractID: this.newContract.id
      });
      this.closeFn();
    },
    async updateContract() {
      const originalContract = this.existingContract;
      const changedFields = this.getChangedFields(
        originalContract,
        this.newContract
      );
      if (Object.keys(changedFields).length === 0) {
        return;
      }
      // Send only the changed fields to the server
      const updatedContract = await ContractService.update(
        this.mapChangedFieldsToApi(changedFields),
        this.newContract.id
      );
      this.$store.commit("contentData/updateContract", {
        contractID: updatedContract.id,
        contractInstance: updatedContract
      });
      await this.updateContractReports(updatedContract);
      this.close();
    },
    getChangedFields(originalContract, updatedContract) {
      const changes = {};
      for (const key in updatedContract) {
        if (
          updatedContract.hasOwnProperty(key) &&
          originalContract.hasOwnProperty(key)
        ) {
          if (key === "createdAt" || key === "modifiedAt") {
            continue;
          }
          if (
            updatedContract[key] instanceof Date &&
            originalContract[key] instanceof Date
          ) {
            if (
              updatedContract[key].getTime() !== originalContract[key].getTime()
            ) {
              changes[key] = updatedContract[key];
            }
          } else if (updatedContract[key] !== originalContract[key]) {
            changes[key] = updatedContract[key];
          }
        }
      }
      return changes;
    },
    dateString(date) {
      return format(date, "yyyy-MM-dd");
    },
    mapChangedFieldsToApi(changedFields) {
      const changedFieldsApi = {};
      for (const key in changedFields) {
        if (
          changedFields.hasOwnProperty(key) &&
          changedFields[key] !== undefined
        ) {
          switch (key) {
            case "startDate":
              changedFieldsApi.start_date = this.dateString(changedFields[key]);
              break;
            case "endDate":
              changedFieldsApi.end_date = this.dateString(changedFields[key]);
              break;
            case "initialCarryoverMinutes":
              changedFieldsApi.initial_carryover_minutes = changedFields[key];
              break;
            case "initialVacationCarryoverMinutes":
              changedFieldsApi.initial_vacation_carryover_minutes =
                changedFields[key];
              break;
            case "worktimeModelName":
              changedFieldsApi.worktime_model_name = changedFields[key];
              break;
            case "percentFte":
              changedFieldsApi.percent_fte = changedFields[key];
              break;
            default:
              changedFieldsApi[key] = changedFields[key];
          }
        }
      }
      return changedFieldsApi;
    },
    initializeNewContract() {
      this.newContract =
        this.existingContract !== undefined
          ? this.existingContract.clone()
          : new Contract();
    },
    closeFn() {
      this.closed = true;
      this.v$.$reset();
      this.initializeNewContract();
      this.close();
    },
    async updateContractReports(contract) {
      const reportData = await ReportService.filterList(
        `?contract=${contract.id}`
      );
      this.$store.commit("contentData/setReports", {
        contractID: contract.id,
        reportData: reportData
      });
    }
  }
};
</script>

<style scoped></style>
