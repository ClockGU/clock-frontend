import Vue from "vue";
import Vuetify from "vuetify/lib";
import de from "vuetify/es5/locale/de";
import en from "vuetify/es5/locale/en";

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: "mdiSvg"
  },
  lang: {
    locales: { de, en },
    current: "de"
  },
  theme: {
    options: {
      customProperties: true
    },
    themes: {
      dark: {
        footerPrimary: "primary darken-4",
        footerSecondary: "primary darken-3"
      },
      light: {
        footerPrimary: "primary darken-2",
        footerSecondary: "primary lighten-1"
      }
    }
  }
});
