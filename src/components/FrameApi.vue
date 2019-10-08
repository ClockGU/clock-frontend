<script>
import FramePromise from "@/components/FramePromise";

export default {
  props: {
    endpoint: {
      required: true,
      type: Function
    },
    immediate: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      response: undefined
    };
  },
  created() {
    if (this.immediate) this.query();
  },
  methods: {
    async query(...params) {
      try {
        const response = await this.endpoint(...params);
        this.response = new Promise(resolve => resolve(response));
        this.$emit("success", { data: this.response });
      } catch (error) {
        // We probably came from `api.service.js` and need to logout.
        // The error is undefined and we quit here.
        if (error === undefined) return;

        this.$store.dispatch("snackbar/setSnack", {
          snack: error.message,
          timeout: 0,
          color: "error"
        });
      }
    }
  },
  render(h) {
    return h(FramePromise, {
      props: {
        promise: this.response
      },
      scopedSlots: {
        default: props =>
          this.$scopedSlots.default({
            data: props.value && props.value.data,
            meta: props.value && props.value.meta,
            methods: {
              query: this.query
            },
            status: {
              error: props.status.error,
              loading: props.status.pending,
              success: props.status.resolved
            }
          })
      }
    });
  }
};
</script>
