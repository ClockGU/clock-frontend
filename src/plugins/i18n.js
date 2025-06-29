import { reactive } from "vue";
import { de, enUS as en } from "date-fns/locale";
import { createI18n } from "vue-i18n";
import deLocale from "../locales/de.json";
import enLocale from "../locales/en.json";
import deAriaLocale from "../locales/de-aria.json";
import enAriaLocale from "../locales/en-aria.json";

const LOCALES = { de, en };

const localeMessages = {
  de: { ...deLocale, ...deAriaLocale },
  en: { ...enLocale, ...enAriaLocale }
};
export const switchDateFnsLocale = (locale) => {
  currentLocale.locale = LOCALES[locale];
};
export const currentLocale = reactive({ locale: de });

// async function loadLocaleMessages() {
//   const de = await import("../locales/de.json", { assert: {type: "json" }});
//   const en = await import("../locales/en.json", { assert: {type: "json" }});
//
//   return  {
//     "de" : de,
//     "en" : en
//   };
// const locales = require.context(
//   "../locales",
//   true,
//   /[A-Za-z0-9-_,\s]+\.json$/i
// );
// const messages = {};
// locales.keys().forEach((key) => {
//   const matched = key.match(/([A-Za-z0-9-_]+)\./i);
//   if (matched && matched.length > 1) {
//     const locale = matched[1];
//     messages[locale] = locales(key);
//   }
// });
// return messages;
// }

function checkDefaultLanguage() {
  let matched = null;
  let languages = Object.getOwnPropertyNames(localeMessages);
  languages.forEach((lang) => {
    if (lang === navigator.language) {
      matched = lang;
    }
  });
  if (!matched) {
    languages.forEach((lang) => {
      let languagePartials = navigator.language.split("-")[0];
      if (lang === languagePartials) {
        matched = lang;
      }
    });
  }
  if (!matched) {
    languages.forEach((lang) => {
      let languagePartials = navigator.language.split("-")[0];
      if (lang.split("-")[0] === languagePartials) {
        matched = lang;
      }
    });
  }
  return matched;
}
export const selectedLocale =
  checkDefaultLanguage() || import.meta.env.VUE_APP_I18N_LOCALE || "de";

export default new createI18n({
  locale: "de",
  allowComposition: true,
  fallbackLocale: import.meta.env.VUE_APP_I18N_FALLBACK_LOCALE || "en",
  messages: localeMessages
});
