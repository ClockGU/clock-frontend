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
      <calendar-toolbar></calendar-toolbar>
    </v-toolbar>
    <v-content>
      <calendar></calendar>
    </v-content>
  </v-app>
</template>

<script>
import Calendar from "@/components/Calendar";
import CalendarToolbar from "@/components/CalendarToolbar";

export default {
  components: { Calendar, CalendarToolbar },
  data: () => ({
    drawer: null
  })
};
</script>
