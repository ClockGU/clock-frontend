<template>
  <base-layout>
    <template v-slot:title>Dashboard</template>
    <template v-slot:content>
      <v-card-text>Some dashboard information</v-card-text>
    </template>

    <template v-slot:extra-content>
      <v-col cols="12" md="6">
        <ClockInOutCard
          :clocked-shift="clockedShift"
          :selected-contract="selectedContract"
        />
      </v-col>
    </template>
  </base-layout>
</template>

<script>
import ClockInOutCard from "@/components/ClockInOutCard";

import { mapGetters } from "vuex";

export default {
  name: "Dashboard",
  components: { ClockInOutCard },
  computed: {
    ...mapGetters({
      clockedShift: "clock/clockedShift",
      selectedContract: "selectedContract"
    })
  }
};
</script>
