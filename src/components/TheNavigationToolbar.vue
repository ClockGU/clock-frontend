<template>
  <v-toolbar class="mt-12 pt-4" max-height="10px" flat tag="nav">
    <v-tabs centered optional>
      <v-tab
        v-for="item in links"
        :key="item.text"
        :to="item.to"
        :ripple="false"
      >
        <v-icon left>{{ item.icon }}</v-icon>
        {{ item.text }}
      </v-tab>
    </v-tabs>
  </v-toolbar>
</template>

<script>
import { getRouterProps } from "@/utils/date";
import { mapGetters } from "vuex";
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
    ...mapGetters({ selectedContractUUID: "contract/selectedContractUUID" }),
    links() {
      return [
        {
          text: this.$t("app.dashboard"),
          to: {
            name: "dashboard",
            params: { contract: this.selectedContractUUID }
          },
          icon: mdiHome,
          loggedOut: false
        },
        {
          text: this.$t("app.calendar"),
          to: {
            name: "calendar",
            params: {
              ...getRouterProps("month", new Date()),
              contract: this.selectedContractUUID
            }
          },
          icon: mdiCalendar,
          loggedOut: false
        },
        {
          text: this.$t("app.shifts"),
          to: {
            name: "shiftList",
            params: { contract: this.selectedContractUUID }
          },
          icon: mdiFormatListNumbered,
          loggedOut: false
        },
        {
          text: this.$t("app.contracts"),
          to: {
            name: "contractList",
            params: { contract: this.selectedContractUUID }
          },
          icon: mdiFileDocument,
          loggedOut: false
        },
        {
          text: this.$t("app.reports"),
          to: {
            name: "reporting",
            params: { contract: this.selectedContractUUID }
          },
          icon: mdiFileChart,
          loggedOut: false
        }
      ];
    }
  }
};
</script>
