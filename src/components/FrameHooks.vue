<script>
export default {
  watch: {
    $route: {
      handler(current, prev) {
        const currentQueryString = JSON.stringify(current.query);
        const prevQueryString = JSON.stringify(prev.query);
        const queryChanged = currentQueryString !== prevQueryString;
        if (queryChanged) {
          this.$emit("route-query-change", current.query);
        }
      }
    }
  },
  created() {
    // As soon as this component is created, it's parent component
    // must have already been created, so we immediately trigger the hook.
    this.$emit("created");

    const triggerMounted = () => this.$emit("mounted");
    this.$parent.$on("hook:mounted", triggerMounted);

    const triggerUpdated = () => this.$emit("updated");
    this.$parent.$on("hook:updated", triggerUpdated);

    this.$once("hook:beforeDestroy", () => {
      this.$parent.$off("hook:mounted", triggerMounted);
      this.$parent.$off("hook:updated", triggerUpdated);
    });
  },
  render() {
    // Render the first child of the default slot.
    return this.$slots.default[0];
  }
};
</script>
