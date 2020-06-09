<template>
  <base-layout
    alternative-portal-target="card-toolbar"
    col-classes="py-0"
    :card-elevation="$vuetify.breakpoint.smAndDown ? 0 : null"
  >
    <template v-slot:card-top>
      <portal-target name="card-toolbar"></portal-target>
    </template>

    <template v-slot:pre-toolbar-title="{ action }">
      <v-app-bar-nav-icon
        v-if="$vuetify.breakpoint.smAndDown"
        icon
        @click="action"
      ></v-app-bar-nav-icon>
    </template>

    <template v-slot:title>
      404 - Not Found
    </template>

    <template v-slot:content>
      <placeholder name="UndrawBlankCanvas">
        Hmm, hier ist irgendetwas schief gegangen. Die angeforderte Seite
        existiert nicht.

        <v-row justify="center">
          <v-btn color="primary" text :to="{ name: 'dashboard' }">
            Zurück zum Dashboard
          </v-btn>
        </v-row>
      </placeholder>
    </template>
  </base-layout>
</template>

<script>
export default {
  name: "NotFound"
};
</script>
