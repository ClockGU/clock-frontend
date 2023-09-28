<template>
  <v-card :elevation="0">
    <v-card-text :class="mdAndUp ? 'py-0' : ''">
      {{ $t("settings.language.text") }}
    </v-card-text>

    <v-card-actions>
      <LanguageSwitcher />
    </v-card-actions>
  </v-card>
</template>

<script>
import LanguageSwitcher from "@/components/LanguageSwitcher.vue";
import { useDisplay } from "vuetify";

export default {
  name: "LanguageSettings",
  components: { LanguageSwitcher },
  computed: {
    mdAndUp() {
      const { mdAndUp } = useDisplay();
      return mdAndUp;
    },
  }
};
</script>
