<template>
  <v-row justify="center">
    <v-col cols="12" md="6">
      <v-card>
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
      <ClockInOutCard
        :clocked-shift="clockedShift"
        :selected-contract="selectedContract"
      />
    </v-col>

    <v-col cols="12" md="6">
      <MessageListCard />
    </v-col>
  </v-row>
</template>

<script>
import ClockInOutCard from "@/components/ClockInOutCard";
import MessageListCard from "@/components/MessageListCard";

import { mapGetters } from "vuex";

export default {
  name: "Dashboard",
  components: { ClockInOutCard, MessageListCard },
  computed: {
    ...mapGetters({
      clockedShift: "clock/clockedShift",
      selectedContract: "selectedContract"
    })
  }
};
</script>
