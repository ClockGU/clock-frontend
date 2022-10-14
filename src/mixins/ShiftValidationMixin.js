export default {
  computed: {
    alertMessages() {
      return [];
    },
    valid() {
      return true;
    },
    timeErrors() {
      let messages = [];
      if (this.newShift.started > this.newShift.stopped) {
        messages.push(this.$t("shifts.errors.startedBeforeStopped"));
      }
      return messages;
    }
  }
};
