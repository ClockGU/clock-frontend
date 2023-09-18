<template>
  <base-layout
    alternative-portal-target="card-toolbar"
    :card-elevation="$vuetify.breakpoint.smAndDown ? 0 : null"
  >
    <template #card-top>
      <portal-target name="card-toolbar"></portal-target>
    </template>

    <template #pre-toolbar-title="{ action }">
      <v-app-bar-nav-icon
        v-if="$vuetify.breakpoint.smAndDown"
        icon
        @click="action"
      ></v-app-bar-nav-icon>
    </template>

    <template #title> 404 - Not Found </template>

    <template #content>
      <placeholder name="UndrawBlankCanvas">
        Hmm, hier ist irgendetwas schief gegangen. Die angeforderte Seite
        existiert nicht.

        <v-row justify="center">
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
        </v-row>
      </placeholder>
    </template>
  </base-layout>
</template>

<script>
export default {
  name: "NotFound",
  metaInfo() {
    return {
      title: this.$t("app.notfound")
    };
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters["auth/loggedIn"];
    }
  }
};
</script>
