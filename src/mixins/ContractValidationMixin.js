import { useVuelidate } from "@vuelidate/core";

export default {
  setup() {
    return {
      v$: useVuelidate()
    };
  },
  computed: {
    alertMessages() {
      return [];
    },
    valid() {
      return !this.v$.$silentErrors.length > 0;
    }
  }
};
