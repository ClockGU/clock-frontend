<template>
  <v-app-bar app dark color="blue" absolute text>
    <v-app-bar-nav-icon @click="$emit('toggle')">
      <v-icon v-if="!isMobile && !mini">{{ icons.mdiChevronLeft }}</v-icon>
      <v-icon v-else-if="!isMobile && mini">{{ icons.mdiChevronRight }}</v-icon>
      <v-icon v-else>{{ icons.mdiMenu }}</v-icon>
    </v-app-bar-nav-icon>

    <template v-if="showSelectContractButton">
      <v-btn
        data-cy="select-contract-button"
        text
        :to="{ path: '/select/' }"
        exact
      >
        {{ selectedContract.name }}
      </v-btn>
      <ClockInOutButton
        v-if="showClockInOutButton"
        :selected-contract="selectedContract"
        :clocked-shift="clockedShift"
      />
    </template>
  </v-app-bar>
</template>

<script>
import ClockInOutButton from "@/components/ClockInOutButton";

import { mapGetters } from "vuex";

import { mdiChevronLeft, mdiChevronRight, mdiMenu } from "@mdi/js";

export default {
  name: "TheAppBar",
  components: {
    ClockInOutButton
  },
  props: {
    mini: {
      type: Boolean,
      default: true
    },
    isMobile: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    mini: true,
    icons: {
      mdiChevronLeft: mdiChevronLeft,
      mdiChevronRight: mdiChevronRight,
      mdiMenu: mdiMenu
    }
  }),
  computed: {
    ...mapGetters({
      selectedContract: "selectedContract",
      clockedShift: "shift/clockedShift"
    }),
    showClockInOutButton() {
      return this.clockedShift !== undefined;
    },
    showSelectContractButton() {
      return this.selectedContract !== null;
    }
  }
};
</script>
