<template>
  <v-card>
    <v-toolbar :elevation="0">
      <v-btn icon @click="$emit('updateWindow', -1)">
        <v-icon>{{ icons.mdiArrowLeft }}</v-icon>
      </v-btn>
      <v-toolbar-title>
        {{ $t("dashboard.clock.problems.title") }}
      </v-toolbar-title>
    </v-toolbar>

    <v-card-text>
      <ClockedShiftSplitWarning @save="save" />
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
    save(length) {
      this.$emit("refresh");
      this.$emit("updateWindow", -1);
      this.destroy(false).then(() => {
        let message =
          this.$t("dashboard.clock.problems.messages.success") + " ";
        if (length > 1) {
          message += this.$t("dashboard.clock.problems.messages.allSaved");
        } else if (length === 1) {
          message += this.$t("dashboard.clock.problems.messages.singleSaved");
        } else {
          message += this.$t("dashboard.clock.problems.messages.noSaved");
        }
        this.$store.dispatch("snackbar/setSnack", {
          snack: message,
          timeout: 4000,
          color: "success"
        });
      });
    }
  }
};
</script>
