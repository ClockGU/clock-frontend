<template>
  <div>
    <v-select
      v-model="v$.contract.$model"
      :items="choices"
      :prepend-icon="icons.mdiFileDocumentEditOutline"
      :label="$t('shifts.changeContract')"
      item-text="name"
      item-value="id"
      return-object
      filled
      :error-messages="mappedErrors"
    >
      <template #selection="contractSelection">
        {{
          contractSelection.item.name + contractStatus(contractSelection.item)
        }}
      </template>
      <template #item="contractSelection">
        {{
          contractSelection.item.name + contractStatus(contractSelection.item)
        }}
      </template>
    </v-select>
  </div>
</template>

<script>
import { mdiFileDocumentEditOutline } from "@mdi/js";
import { mapGetters } from "vuex";
import contractValidMixin from "@/mixins/contractValid";
import { helpers } from "@vuelidate/validators";
import { endOfDay, isAfter, isBefore, startOfDay } from "date-fns";
import { useVuelidate } from "@vuelidate/core";
const notContractFuture = (date) => (value) => {
  const contractStartDate = startOfDay(value.startDate);
  return !(isBefore(date, contractStartDate) && value.id !== null);
};
const notContractExpired = (date) =>
  helpers.withParams(
    { type: "notContractExpired", value: date },
    (contract) => {
      const contractEndDate = endOfDay(contract.endDate);
      return !(isAfter(date, contractEndDate) && contract.id !== null);
    }
  );

export default {
  name: "ShiftFormSelectContract",
  mixins: [contractValidMixin],
  props: {
    value: {
      type: String,
      required: true
    },
    validationDate: {
      type: Date,
      required: false,
      default: () => new Date()
    }
  },
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      icons: {
        mdiFileDocumentEditOutline
      },
      contract: null,
      dateToValidate: this.validationDate
    };
  },
  validations() {
    return {
      contract: {
        notContractFuture: helpers.withMessage(
          "Is Future.",
          notContractFuture(this.dateToValidate)
        ),
        notContractExpired: helpers.withMessage(
          "Is Expired",
          notContractExpired(this.dateToValidate)
        )
      }
    };
  },
  computed: {
    ...mapGetters({
      selectedContract: "selectedContract/selectedContract",
      choices: "contentData/allContracts"
    }),
    mappedErrors() {
      return this.v$.$errors.map((error) => error.$message);
    }
  },
  watch: {
    value(val) {
      if (val === "") {
        this.contract = this.selectedContract;
      } else {
        this.contract = this.$store.getters["contentData/contractById"](val);
      }
      if (this.contract.id === this.selectedContract.id) {
        this.$emit("input", this.contract.id);
      }
    },
    validationDate(val) {
      this.dateToValidate = val;
    },
    contract(val) {
      this.$emit("input", val.id);
    }
  },
  created() {
    if (this.value !== "") {
      this.contract = this.$store.getters["contentData/contractById"](
        this.value
      );
    } else {
      this.contract = this.$store.getters["selectedContract/selectedContract"];
    }
  },
  methods: {
    contractStatus(contract) {
      if (this.specificContractInFuture(contract))
        return " " + this.$t("contracts.inFuture");
      if (this.specificContractExpired(contract))
        return " " + this.$t("contracts.expired");
      else return "";
    }
  }
};
</script>

<style scoped></style>
