<template>
  <v-card :elevation="$vuetify.breakpoint.mdAndUp ? 0 : null">
    <v-card-text :class="$vuetify.breakpoint.mdAndUp ? 'py-0' : ''">
      <LanguageSwitcher />
    </v-card-text>
  </v-card>
</template>

<script>
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default {
  name: "LanguageSettings",
  components: { LanguageSwitcher }
};
</script>
