<template>
  <v-card :elevation="$vuetify.breakpoint.mdAndUp ? 0 : null">
    <v-card-text :class="$vuetify.breakpoint.mdAndUp ? 'py-0' : ''">
      {{ $t("settings.language.text") }}
    </v-card-text>

    <v-card-actions>
      <LanguageSwitcher @updateLocale="update" />
    </v-card-actions>
  </v-card>
</template>

<script>
import LanguageSwitcher from "@/components/LanguageSwitcher";
import AuthService from "@/services/auth";
import { log } from "@/utils/log";

export default {
  name: "LanguageSettings",
  components: { LanguageSwitcher },
  methods: {
    async update(locale) {
      try {
        await AuthService.updateSettings({ language: locale });
        this.$store.dispatch("changeLocale", locale);
      } catch (error) {
        log(error);
      }
    }
  }
};
</script>
