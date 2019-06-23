import { Contract } from "@/models/Contracts";
import { createHelpers } from "vuex-map-fields";

import uuid from "uuid/v4";
// import ContractService from "@/services/contract.service";

const { mapFields } = createHelpers({
  getterType: "contract/getField",
  mutationType: "contract/updateField"
});

export default {
  name: "ContractModel",
  props: {
    uuid: {
      type: String,
      default: null
    }
  },
  data: () => ({
    contract: null
  }),
  created() {
    this.contract =
      this.contracts.find(contract => contract.uuid === this.uuid) ||
      new Contract();
  },
  computed: {
    ...mapFields(["contracts"]),
    index() {
      return this.contracts.findIndex(contract => contract.uuid === this.uuid);
    },
    remainingContracts() {
      return this.contracts.filter(contract => contract.uuid !== this.uuid);
    }
  },
  watch: {
    contract: {
      handler(val) {
        if (!val.hours) return;

        let [hours, minutes] = val.hours.split(":");

        if (minutes > 59) {
          minutes = 59;
        }

        val.hours = `${hours}:${minutes}`;
      },
      deep: true
    }
  },
  methods: {
    async create() {
      const id = uuid();
      console.log("Adding new contract.");
      this.contract.uuid = id;

      // TODO: Using vuex-map-fields will actually put "this.contracts" as payload into the mutation. This might be a performance problem at some point. Also hitting a real API with this will probably not work..?
      this.contracts = [this.contract, ...this.contracts];

      // const data = this.contract.toPayload();
      // await ContractService.create(data, uuid);
      this.contract = new Contract();
    },
    update() {
      console.log("Updating contract.");
      this.contracts[this.index] = this.contract;
    },
    destroy() {
      console.log("Deleting contracts.");
      this.contracts = this.remainingContracts;
    }
  },
  render() {
    return this.$scopedSlots.default({
      create: this.create,
      data: this.contract,
      destroy: this.destroy,
      update: this.update
    });
  }
};
