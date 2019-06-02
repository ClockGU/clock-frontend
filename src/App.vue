<template>
  <v-app id="keep">
    <v-navigation-drawer
      v-model="drawer"
      fixed
      clipped
      class="grey lighten-4"
      app
    >
      <v-list>
        <v-list-tile exact v-for="link in links" :to="link.to" :key="link.text">
          <v-list-tile-action>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            {{ link.text }}
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="amber" app absolute flat clipped-left>
      <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
      <portal-target name="toolbar"></portal-target>
    </v-toolbar>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    drawer: null,
    links: [
      {
        text: "Calendar",
        to: { name: "c" },
        icon: "home"
      },
      {
        text: "Shifts",
        to: { name: "shiftList" },
        icon: "list"
      },
      {
        text: "Add Shift",
        to: { name: "createShift" },
        icon: "add"
      },
      {
        text: "Add Contract",
        to: { name: "createContract" },
        icon: "description"
      },
      {
        text: "Clock in",
        to: { name: "clockInOut" },
        icon: "lock"
      }
    ]
  })
};
</script>
