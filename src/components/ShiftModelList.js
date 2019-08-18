import queryMixin from "./ShiftQuery";

export default {
  mixins: [queryMixin],
  props: {
    // Provide a filter to limit the
    // results of the API request.
    filter: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      data: null
    };
  },
  watch: {
    // Load the data from the given endpoint
    // on initial rendering of the component and
    // every time the filter property changes.
    filter: {
      immediate: true,
      handler: "load"
    }
  },
  methods: {
    load() {
      return this.query("get", this.endpoint, { params: this.filter });
    }
  },
  render() {
    return this.$scopedSlots.default({
      data: this.data,
      error: this.error,
      load: this.load,
      loading: this.loading
    });
  }
};
