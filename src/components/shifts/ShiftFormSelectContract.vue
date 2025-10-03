<template>
  <div>
    <label for="shift-form-select-contract" class="ml-10">{{$t('shifts.changeContract')  }}</label>
    <v-select
      id="shift-form-select-contract"
      v-model="v$.contract.$model"
      :items="choices"
      :prepend-icon="icons.mdiFileDocumentEditOutline"
      item-title="name"
      item-value="id"
      return-object
      filled
      :error-messages="mappedErrors"
      aria-label="Select a contract"
    >
      <template #selection="{ item }">
        {{ item.title + contractStatus(item.raw) }}
      </template>
      <template #item="{ item, props }">
        <v-list-item v-bind="modifyProps(props)" :aria-label="item.title">
          {{ item.title + contractStatus(item.raw) }}
        </v-list-item>
      </template>
    </v-select>
  </div>
</template>

<script>
import { mdiFileDocumentEditOutline } from "@mdi/js";
import { mapGetters } from "vuex";
import contractValidMixin from "@/mixins/contractValid";
import { helpers } from "@vuelidate/validators";
import { endOfDay, isAfter } from "date-fns";
import { useVuelidate } from "@vuelidate/core";
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
    modelValue: {
      type: String,
      required: true
    },
    validationDate: {
      type: Date,
      required: false,
      default: () => new Date()
    }
  },
  emits: ["update:modelValue"],
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
        notContractExpired: helpers.withMessage(
          this.$t("contracts.expired"),
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
    modelValue(val) {
      if (val === "") {
        this.contract = this.selectedContract;
      } else {
        this.contract = this.$store.getters["contentData/contractById"](val);
      }
      if (this.contract.id === this.selectedContract.id) {
        this.$emit("update:modelValue", this.contract.id);
      }
    },
    validationDate(val) {
      this.dateToValidate = val;
    },
    contract(val) {
      this.$emit("update:modelValue", val.id);
    }
  },
  created() {
    if (this.modelValue !== "") {
      this.contract = this.$store.getters["contentData/contractById"](
        this.modelValue
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
    },
    modifyProps(props) {
      delete props.title;
      return props;
    }
  }
};
</script>
