<template>
  <v-menu
    v-model="menu"
    location="bottom left"
    offset-y
    max-height="calc(100% - 16px)"
    transition="slide-y-transition"
    :close-on-content-click="false"
  >
    <template #activator="{ props }">
      <v-btn
        class="text-capitalize"
        variant="text"
        v-bind="props"
        :aria-label="$t('aria.languageSwitcher')"
        aria-haspopup="true"
        aria-expanded="false"
      >
        <v-icon :start="smAndUp" :icon="icons.mdiTranslate" />
        <span
          class="text-subtitle-1 text-capitalize font-weight-light hidden-xs-and-down"
          v-text="selectedLocale"
        />
        <v-icon class="hidden-sm-and-down" :icon="icons.mdiChevronDown" end />
      </v-btn>
    </template>

    <v-list density="compact" nav role="menu">
      <v-list-item
        v-for="item in locales"
        :key="item.locale"
        :role="
          item.locale === $i18n.locale
            ? 'menuitemradio checked'
            : 'menuitemradio'
        "
        :aria-checked="item.locale === $i18n.locale"
        @click="switchLocale(item.locale)"
      >
        <v-list-item-title>{{ item.name }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { mdiChevronDown, mdiTranslate } from "@mdi/js";
import ApiService from "@/services/api";
import AuthService from "@/services/auth";
import { log } from "@/utils/log";

export default {
  name: "LanguageSwitcher",
  data: () => ({
    menu: false,
    icons: { mdiChevronDown, mdiTranslate },
    locales: [
      { name: "Deutsch", locale: "de" },
      { name: "English", locale: "en" }
    ]
  }),
  computed: {
    smAndUp() {
      return this.$vuetify.display.smAndUp;
    },
    selectedLocale() {
      const match = this.locales.find(
        (locale) => locale.locale === this.$i18n.locale
      );
      return match.name || this.locales[0].name;
    }
  },
  methods: {
    async switchLocale(locale) {
      if (this.$i18n.locale === locale) {
        return;
      }
      this.$i18n.locale = locale;
      this.menu = false;
      // Update Vuetify settings
      this.$vuetify.locale.current = locale;
      // Manually update the 'lang' attribute on the <html> element
      document.documentElement.setAttribute("lang", locale);

      // Update locale for API requests
      await ApiService.setHeader("Accept-Language", locale);
      try {
        await AuthService.updateSettings({ language: locale });
      } catch (error) {
        log(error);
      } finally {
        await this.$store.dispatch("changeLocale", locale);
      }
    }
  }
};
</script>
