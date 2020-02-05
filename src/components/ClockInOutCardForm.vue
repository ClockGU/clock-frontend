<template>
  <v-card>
    <v-toolbar :elevation="0">
      <v-btn icon @click="$emit('updateWindow', -1)">
        <v-icon>{{ icons.mdiArrowLeft }}</v-icon>
      </v-btn>
      <v-toolbar-title>
        Your clocked shift spans multiple days
      </v-toolbar-title>
    </v-toolbar>

    <v-card-text>
      <ClockedShiftSplitWarning :clocked-shift="clockedShift" @save="save" />
    </v-card-text>
  </v-card>
</template>

<script>
import ClockedShiftSplitWarning from "@/components/ClockedShiftSplitWarning";

import { mdiArrowLeft } from "@mdi/js";

export default {
  name: "ClockInOutCardForm",
  components: { ClockedShiftSplitWarning },
  props: {
    clockedShift: {
      type: Object,
      required: true
    },
    destroy: {
      type: Function,
      required: true
    }
  },
  data: () => ({
    dialog: false,
    icons: { mdiArrowLeft }
  }),
  methods: {
    save() {
      this.destroy(false).then(() => {
        this.$store.dispatch("snackbar/setSnack", {
          snack: "Saved shift(s).",
          timeout: 4000,
          color: "success"
        });
        this.$emit("updateWindow", -1);
      });
    }
  }
};
</script>
