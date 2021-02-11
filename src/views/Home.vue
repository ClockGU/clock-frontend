<template>
  <v-main>
    <v-alert v-if="staging" type="warning" dark>Staging</v-alert>
    <v-container :style="styles" style="height: 100%" fluid>
      <router-view></router-view>
    </v-container>

    <portal-target name="fab"></portal-target>
  </v-main>
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
      const removePadding =
        this.$vuetify.breakpoint.smAndDown ||
        this.showingCalendar ||
        this.$route.path === "/";
      if (removePadding) {
        styles = {
          padding: "0"
        };
      }

      return styles;
    },
    staging() {
      return process.env.VUE_APP_ENV === "staging";
    }
  }
};
</script>
