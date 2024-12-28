export default {
  computed: {
    smAndUp() {
      return this.$vuetify.display.smAndUp;
    },
    smAndDown() {
      return this.$vuetify.display.smAndDown;
    }

    /*isXsOnly() {
        return this.$vuetify.display.xsOnly;
      },
      smOnly() {
        return this.$vuetify.display.smOnly;
      },
      mdOnly() {
        return this.$vuetify.display.mdOnly;
      },
      lgOnly() {
        return this.$vuetify.display.lgOnly;
      },
      xlOnly() {
        return this.$vuetify.display.xlOnly;
      },
      xsAndUp() {
        return this.$vuetify.display.xsAndUp;
      },
      
      mdAndUp() {
        return this.$vuetify.display.mdAndUp;
      },
      lgAndUp() {
        return this.$vuetify.display.lgAndUp;
      },
      xlAndUp() {
        return this.$vuetify.display.xlAndUp;
      },
      xsAndDown() {
        return this.$vuetify.display.xsAndDown;
      },
      mdAndDown() {
        return this.$vuetify.display.mdAndDown;
      },
      lgAndDown() {
        return this.$vuetify.display.lgAndDown;
      },*/
  }
};
