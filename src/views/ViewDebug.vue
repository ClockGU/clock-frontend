<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>Debug</h1>
      </v-col>
    </v-row>

    <v-card>
      <v-card-title>
        Short shift
      </v-card-title>

      <v-card-text>
        Create a short shift, that is exactly 5 minutes long. Will prompt the
        "short shift warning".
      </v-card-text>

      <v-card-actions>
        <v-btn color="primary" text @click="shortShift">Create</v-btn>
      </v-card-actions>
    </v-card>

    <v-card>
      <v-card-title>
        Overflow shift
      </v-card-title>

      <v-card-text>
        Create a overflow shift, that starts on one day and ends on the other.
        Will prompt the "shift split warning".
      </v-card-text>

      <v-card-actions>
        <v-btn color="primary" text @click="overflowShift">Create</v-btn>
      </v-card-actions>
    </v-card>

    <v-card>
      <v-card-title>
        Very long shift
      </v-card-title>

      <v-card-text>
        Create a very long shift, spanning multiple days. Will prompt the "shift
        split warning".
      </v-card-text>

      <v-card-actions>
        <v-btn color="primary" text @click="veryLongShift">Create</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { subMinutes, subDays } from "date-fns";

export default {
  name: "ViewDebug",
  data: () => ({
    shift: {
      start: null,
      contract: null
    }
  }),
  methods: {
    shortShift() {
      const now = new Date();
      const start = subMinutes(now, 5);
      const contract = this.$store.state.selectedContract.uuid;

      const shift = { start, contract };

      this.$store.dispatch("shift/clockShift", shift);
      location.reload(true);
    },
    overflowShift() {
      const now = new Date();
      const start = subDays(now, 1);
      const contract = this.$store.state.selectedContract.uuid;

      const shift = { start, contract };

      this.$store.dispatch("shift/clockShift", shift);
      location.reload(true);
    },
    veryLongShift() {
      const now = new Date();
      const start = subDays(now, 4);
      const contract = this.$store.state.selectedContract.uuid;

      const shift = { start, contract };

      this.$store.dispatch("shift/clockShift", shift);
      location.reload(true);
    }
  }
};
</script>
