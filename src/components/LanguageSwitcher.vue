<template>
  <v-menu
    bottom
    left
    offset-y
    max-height="calc(100% - 16px)"
    transition="slide-y-transition"
  >
    <template v-slot:activator="{ attrs, on }">
      <v-btn class="text-capitalize" text v-bind="attrs" v-on="on">
        <v-icon :left="$vuetify.breakpoint.mdAndUp">
          {{ icons.mdiTranslate }}
        </v-icon>

        <span
          class="subtitle-1 text-capitalize font-weight-light hidden-sm-and-down"
          v-text="selectedLocale"
        />
        <v-icon class="hidden-sm-and-down" right>
          {{ icons.mdiChevronDown }}
        </v-icon>
      </v-btn>
    </template>

    <v-list dense nav>
      <v-list-item
        v-for="item in locales"
        :key="item.locale"
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
    selectedLocale() {
      const match = this.locales.find(
        locale => locale.locale === this.$i18n.locale
      );
      return match.name;
    }
  },
  methods: {
    switchLocale(locale) {
      if (this.$i18n.locale === locale) return;

      this.$i18n.locale = locale;

      // Update locale for API requests
      ApiService.setHeader("Accept-Language", locale);
    }
  }
};
</script>
