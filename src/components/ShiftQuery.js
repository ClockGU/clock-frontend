import ApiService from "@/services/api.service";

import { createHelpers } from "vuex-map-fields";

const { mapFields } = createHelpers({
  getterType: "shift/getField",
  mutationType: "shift/updateField"
});

import { mapShifts, mapItemsAndListsToModel } from "@/utils/modelQueries";

export default {
  props: {
    endpoint: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapFields(["shifts"])
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

        this.data = await mapItemsAndListsToModel(this.data, mapShifts);
        this.shifts = this.data;

        this.error = null;
        const emitName = type === "get" ? "get-success" : "success";
        this.$emit(emitName, response);
      } catch (error) {
        this.data = null;
        console.log(error);
        this.error = error.response;
        this.$emit(`error`, error);
      }
      this.loading = false;
    }
  }
};
