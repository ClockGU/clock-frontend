<template>
  <v-app id="keep">
    <v-navigation-drawer
      v-model="drawer"
      fixed
      clipped
      class="grey lighten-4"
      app
    >
      <p>Test</p>
    </v-navigation-drawer>
    <v-toolbar color="amber" app absolute flat clipped-left>
      <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
      <span class="title ml-3 mr-5"
        >Google&nbsp;<span class="font-weight-light">Keep</span></span
      >
    </v-toolbar>
    <v-content>
      <calendar></calendar>
    </v-content>
  </v-app>
</template>

<script>
import Calendar from "@/components/Calendar";

export default {
  components: { Calendar },
  data: () => ({
    drawer: null
  })
};
</script>
