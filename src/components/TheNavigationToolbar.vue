<template>
  <v-toolbar class="mt-12 pt-4" max-height="10px" flat tag="nav">
    <v-tabs centered optional>
      <v-tab
        v-for="item in links"
        :key="item.text"
        :to="item.to"
        exact
        :ripple="false"
      >
        <v-icon left>{{ item.icon }}</v-icon>
        {{ item.text }}
      </v-tab>
    </v-tabs>
  </v-toolbar>
</template>

<script>
import {
  mdiCalendar,
  mdiHome,
  mdiFileDocument,
  mdiFormatListNumbered,
  mdiFileChart
} from "@mdi/js";

export default {
  name: "TheNavigationToolbar",
  data: () => ({
    links: [
      {
        text: "Dashboard",
        to: { name: "dashboard" },
        icon: mdiHome,
        loggedOut: true
      },
      {
        text: "Calendar",
        to: {
          name: "calendar",
          params: { type: "month", year: 2020, month: 1, day: 1 }
        },
        icon: mdiCalendar,
        loggedOut: false
      },
      {
        text: "Shifts",
        to: { name: "shiftList" },
        icon: mdiFormatListNumbered,
        loggedOut: false
      },
      {
        text: "Contracts",
        to: { name: "contractList" },
        icon: mdiFileDocument,
        loggedOut: false
      },
      {
        text: "Report",
        to: { name: "reportList" },
        icon: mdiFileChart,
        loggedOut: false
      }
    ]
  })
};
</script>
