<template>
  <v-footer color="primary-darken-2" theme="dark" style="padding: 0; min-height: 72px">
    <v-row justify="center" no-gutters>
      <v-btn
        v-for="link in links"
        :key="link.text"
        :to="{ name: link.to }"
        color="white"
        variant="text"
        rounded
        class="my-2"
      >
        {{ link.text }}
      </v-btn>
      <v-col
        :class="
          $vuetify.theme.current.footerSecondary +
          ' text-center white--text'
        "
        cols="12"
      >
        <v-row justify="center" class="mx-0 mb-0">
          <v-col cols="10">
            <p>&copy; {{ new Date().getFullYear() }} Clock</p>
            <i18n-t keypath="footer.acknowledgeGU.text" tag="p" scope="global">
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
            </i18n-t>
            <i18n-t keypath="footer.github_repo.text" tag="p" scope="global">
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
            </i18n-t>
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

<style scoped>
p { margin-bottom: 16px}
</style>
