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
      <v-col class="primary lighten-1 text-center white--text" cols="12">
        <v-row justify="center" class="mx-0">
          <v-col cols="10">
            <p>
              &copy; {{ new Date().getFullYear() }} — <strong>Clock</strong>
            </p>
            <i18n path="footer.acknowledgeGU.text" tag="p">
              <template v-slot:link>
                <base-link
                  class="text-no-wrap"
                  :href="$t('footer.acknowledgeGU.url')"
                >
                  <template v-slot:text>{{
                    $t("footer.acknowledgeGU.university")
                  }}</template>
                </base-link>
              </template>
            </i18n>
          </v-col>
        </v-row>
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
