import ApiService from "@/services/api.service";

export default {
  props: {
    endpoint: {
      type: String,
      required: true
    }
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
        // const response = await this.api[type](...params);
        this.data = response.data;
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
