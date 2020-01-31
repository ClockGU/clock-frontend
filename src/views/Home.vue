<template>
  <v-content>
    <v-container :style="styles" style="height: 100%" fluid>
      <router-view></router-view>
    </v-container>

    <portal-target name="fab"></portal-target>
  </v-content>
</template>

<script>
export default {
  name: "Home",
  computed: {
    showingCalendar() {
      return this.$route.name === "calendar" || this.$route.name === "c";
    },
    styles() {
      let styles;
      if (this.$vuetify.breakpoint.smAndDown || this.showingCalendar) {
        styles = {
          padding: "0"
        };
      }

      return styles;
    }
  }
};
</script>
