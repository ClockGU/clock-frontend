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

<script setup>
import { mdiChevronDown, mdiTranslate } from "@mdi/js";
import ApiService from "@/services/api";
import AuthService from "@/services/auth";
import { log } from "@/utils/log";
import { computed, ref } from "vue";
import { useDisplay, useLocale } from "vuetify";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import { switchDateFnsLocale } from "@/plugins/i18n";

const { locale } = useI18n();
const { current } = useLocale();
const store = useStore();

const menu = ref(false);

const icons = { mdiChevronDown, mdiTranslate };

const locales = [
  { name: "Deutsch", locale: "de" },
  { name: "English", locale: "en" }
];

const selectedLocale = computed(() => {
  const match = locales.find((loc) => loc.locale === locale.value);
  return match.name || this.locales[0].name;
});

const { smAndUp } = useDisplay();

async function switchLocale(loc) {
  if (locale === locale.value) {
    return;
  }
  this.menu = false;

  //Update i18n locale
  locale.value = loc;
  // Update Vuetify settings
  current.value = loc;
  // Update Dat-fns loclae
  switchDateFnsLocale(locale);
  // Manually update the 'lang' attribute on the <html> element
  document.documentElement.setAttribute("lang", loc);

  // Update locale for API requests
  await ApiService.setHeader("Accept-Language", loc);
  try {
    await AuthService.updateSettings({ language: loc });
  } catch (error) {
    log(error);
  } finally {
    await store.dispatch("changeLocale", loc);
  }
}
</script>
