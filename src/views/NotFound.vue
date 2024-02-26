<template>
  <base-layout
    alternative-portal-target="card-toolbar"
    :card-elevation="smAndDown ? 0 : null"
  >
    <template #card-top>
      <portal-target name="card-toolbar"></portal-target>
    </template>

    <template #pre-toolbar-title="{ action }">
      <v-app-bar-nav-icon
        v-if="smAndDown"
        icon
        @click="action"
      ></v-app-bar-nav-icon>
    </template>

    <template #title> 404 - Not Found </template>

    <template #content>
      <placeholder name="UndrawBlankCanvas">
        <v-row justify="center" align="center">
          <v-col cols="12" class="d-flex justify-center align-center">
            <p>
              Hmm, hier ist irgendetwas schief gegangen. Die angeforderte Seite
              existiert nicht.
            </p>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="d-flex justify-center align-center">
            <v-btn
              v-if="isLoggedIn"
              color="primary"
              variant="text"
              :to="{ name: 'dashboard' }"
            >
              Zurück zum Dashboard
            </v-btn>
            <v-btn
              v-else
              color="primary"
              variant="text"
              exact
              :to="{ name: 'home' }"
            >
              Zurück zur Startseite
            </v-btn>
          </v-col>
        </v-row>
      </placeholder>
    </template>
  </base-layout>
</template>

<script>
import { useDisplay } from "vuetify";

export default {
  name: "NotFound",
  metaInfo() {
    return {
      title: this.$t("app.notfound")
    };
  },
  computed: {
    smAndDown() {
      const { smAndDown } = useDisplay();
      return smAndDown.value;
    },
    isLoggedIn() {
      return this.$store.getters["auth/loggedIn"];
    }
  }
};
</script>
