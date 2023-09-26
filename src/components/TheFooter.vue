<template>
  <v-footer
    :class="$vuetify.theme.currentTheme.footerPrimary"
    dark
    min-height="72"
    padless
  >
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
      <v-col
        :class="
          $vuetify.theme.currentTheme.footerSecondary +
          ' text-center white--text'
        "
        cols="12"
      >
        <v-row justify="center" class="mx-0 mb-0">
          <v-col cols="10">
            <p>&copy; {{ new Date().getFullYear() }} Clock</p>
            <i18n path="footer.acknowledgeGU.text" tag="p">
              <template #link>
                <base-link
                  class="text-no-wrap"
                  :href="$t('footer.acknowledgeGU.url')"
                >
                  <template #default>{{
                    $t("footer.acknowledgeGU.university")
                  }}</template>
                </base-link>
              </template>
            </i18n>
            <i18n path="footer.github_repo.text" tag="p">
              <template #link>
                <base-link
                  class="text-no-wrap"
                  :href="$t('footer.github_repo.url')"
                >
                  <template #default>{{
                    $t("footer.github_repo.github")
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
