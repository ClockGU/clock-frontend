<template>
  <v-footer color="primary darken-2" dark min-height="72" padless>
    <v-row justify="center" no-gutters>
      <v-btn
        v-for="link in links"
        :key="link.text"
        :to="{ name: link.to }"
        color="white"
        text
        rounded
        class="my-2"
      >
        {{ link.text }}
      </v-btn>
      <v-col class="primary lighten-1 py-4 text-center white--text" cols="12">
        {{ new Date().getFullYear() }} — <strong>Clock</strong>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script>
export default {
  name: "TheFooter",
  computed: {
    links() {
      return [
        { text: this.$t("app.privacy"), to: "privacy" },
        { text: this.$t("app.imprint"), to: "imprint" }
      ];
    }
  }
};
</script>
