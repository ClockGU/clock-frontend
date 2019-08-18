import ApiService from "@/services/api.service";

import { Contract } from "@/models/Contracts";
import { createHelpers } from "vuex-map-fields";

const { mapFields } = createHelpers({
  getterType: "contract/getField",
  mutationType: "contract/updateField"
});

export default {
  props: {
    endpoint: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapFields(["contracts"])
  },
  data() {
    return {
      data: null,
      error: null,
      loading: false
    };
  },
  methods: {
    // The `query` method will handle
    // different query types for us.
    async query(type, ...params) {
      // If we're currently loading content
      // we don't submit an additional request.
      if (this.loading) return;

      this.loading = true;
      try {
        const response = await ApiService[type](...params);
        this.data = response.data;

        if (!Array.isArray(this.data)) {
          // Handle create/update form
          console.log(this.data.start_date);
          this.data = new Contract({
            uuid: this.data.id,
            name: this.data.name,
            date: { start: this.data.start_date, end: this.data.end_date },
            hours: this.data.hours
          });
        } else {
          // handle Contract listings
          this.data = this.data.map(
            contract =>
              new Contract({
                uuid: contract.id,
                name: contract.name,
                date: { start: contract.start_date, end: contract.end_date },
                hours: contract.hours
              })
          );
        }

        this.contracts = this.data;

        this.error = null;
        const emitName = type === "get" ? "get-success" : "success";
        this.$emit(emitName, response);
      } catch (error) {
        this.data = null;
        this.error = error.response;
        this.$emit(`error`, error);
      }
      this.loading = false;
    }
  }
};
