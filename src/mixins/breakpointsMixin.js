export default {
  computed: {
    smAndUp() {
      return this.$vuetify.display.smAndUp;
    },
    smAndDown() {
      return this.$vuetify.display.smAndDown;
    },
    mobile() {
      return this.$vuetify.display.mobile;
    },
    xs() {
      return this.$vuetify.display.xs;
    }
  }
};
