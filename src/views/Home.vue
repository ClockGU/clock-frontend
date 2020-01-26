<template>
  <div>
    <v-container :style="styles">
      <v-content>
        <router-view></router-view>
        <portal-target name="fab"></portal-target>
      </v-content>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "Home",
  computed: {
    styles() {
      let styles;
      if (this.$vuetify.breakpoint.smAndDown) {
        styles = {
          padding: "0"
        };
      }

      if (this.$vuetify.breakpoint.mdAndUp) {
        styles = {
          "margin-top": "48px"
        };
      }

      return styles;
    }
  }
};
</script>
