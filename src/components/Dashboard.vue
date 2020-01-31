<template>
  <v-row justify="center">
    <v-col cols="12" md="6">
      <v-card>
        <!-- <portal-target name="card-toolbar"></portal-target> -->

        <portal :to="$vuetify.breakpoint.smAndDown ? 'app-bar' : ''">
          <v-toolbar slot-scope="{ action }" :elevation="0">
            <v-app-bar-nav-icon
              v-if="$vuetify.breakpoint.smAndDown"
              icon
              @click="action"
            ></v-app-bar-nav-icon>

            <v-toolbar-title>
              Dashboard
            </v-toolbar-title>
          </v-toolbar>
        </portal>

        <v-card-text>Some dashboard information</v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" md="6">
      <v-card>
        <v-card-title>Stats</v-card-title>

        <v-card-text>Some dashboard information</v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "Dashboard"
};
</script>
