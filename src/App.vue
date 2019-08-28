<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app class="grey lighten-4">
      <v-list>
        <v-list-item v-for="link in links" :key="link.text" exact :to="link.to">
          <v-list-item-action>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-item-action>

          <v-list-item-content>{{ link.text }}</v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="amber" absolute text>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <portal-target name="toolbar"></portal-target>
    </v-app-bar>

    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
      <portal-target name="fab"></portal-target>
    </v-content>

    <!-- <v-footer color="indigo" app>
      <span class="white--text">&copy; 2019</span>
    </v-footer>-->
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
        text: "Contracts",
        to: { name: "contractList" },
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
