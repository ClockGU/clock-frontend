<template>
  <v-toolbar
    class="mt-12 pt-4"
    max-height="10px"
    flat
    tag="nav"
    :color="$vuetify.theme.current.colors.background"
  >
    <v-row justify="center">
      <v-tabs>
        <v-tab
          v-for="(item, i) in links"
          :key="item.text"
          :value="i"
          :to="item.to"
          :ripple="false"
        >
          <v-icon start :icon="item.icon"> </v-icon>
          {{ item.text }}
        </v-tab>
      </v-tabs>
    </v-row>
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
  computed: {
    links() {
      return [
        {
          text: this.$t("app.dashboard"),
          to: {
            name: "dashboard"
          },
          icon: mdiHome,
          loggedOut: false
        },
        {
          text: this.$t("app.calendar"),
          to: {
            name: "calendar"
          },
          icon: mdiCalendar,
          loggedOut: false
        },
        {
          text: this.$t("app.shifts"),
          to: {
            name: "shiftList"
          },
          icon: mdiFormatListNumbered,
          loggedOut: false
        },
        {
          text: this.$t("app.contracts"),
          to: {
            name: "contractList"
          },
          icon: mdiFileDocument,
          loggedOut: false
        },
        {
          text: this.$t("app.reports"),
          to: {
            name: "reporting"
          },
          icon: mdiFileChart,
          loggedOut: false
        }
      ];
    }
  }
};
</script>
