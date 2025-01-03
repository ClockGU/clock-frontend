export default {
  computed: {
    smAndUp() {
      return this.$vuetify.display.smAndUp;
    },
    smAndDown() {
      return this.$vuetify.display.smAndDown;
    },
    isMobile() {
      return this.$vuetify.display.mobile;
    },
    isXs() {
      return this.$vuetify.display.xs;
    }
  }
};
