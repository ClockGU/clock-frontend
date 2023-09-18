<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>Debug</h1>
      </v-col>
    </v-row>

    <v-card>
      <SelectContractFilter />
    </v-card>

    <v-card>
      <v-card-title> Short shift </v-card-title>

      <v-card-text>
        Create a short shift, that is exactly 5 minutes long. Will prompt the
        "short shift warning".
      </v-card-text>

      <v-card-actions>
        <v-btn color="primary" variant="text" @click="shortShift">Create</v-btn>
      </v-card-actions>
    </v-card>

    <v-card>
      <v-card-title> Overflow shift </v-card-title>

      <v-card-text>
        Create a overflow shift, that starts on one day and ends on the other.
        Will prompt the "shift split warning".
      </v-card-text>

      <v-card-actions>
        <v-btn color="primary" variant="text" @click="overflowShift"
          >Create</v-btn
        >
      </v-card-actions>
    </v-card>

    <v-card>
      <v-card-title> Very long shift </v-card-title>

      <v-card-text>
        Create a very long shift, spanning multiple days. Will prompt the "shift
        split warning".
      </v-card-text>

      <v-card-actions>
        <v-btn color="primary" variant="text" @click="veryLongShift"
          >Create</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { subMinutes, subDays } from "date-fns";
import SelectContractFilter from "@/components/SelectContractFilter.vue";
import { Shift } from "@/models/ShiftModel";

export default {
  name: "ViewDebug",
  metaInfo() {
    return {
      title: this.$t("app.debug")
    };
  },
  components: { SelectContractFilter },
  data: () => ({
    shift: {
      start: null,
      contract: null
    }
  }),
  methods: {
    shortShift() {
      const now = new Date();
      const started = subMinutes(now, 5);
      const contract = this.$store.getters["selectedContract/selectedContract"]
        .id;

      const shift = new Shift({
        started,
        stopped: now,
        contract,
        wasReviewed: true
      });
      this.$store
        .dispatch("contentData/saveShift", shift.toPayload())
        .then(() => {
          this.$store.dispatch("snackbar/setSnack", {
            message: "Debug: Shirt shift created.",
            timePassed: 0,
            timeout: 4000,
            color: "success",
            show: true
          });
        });
    },
    overflowShift() {
      const now = new Date();
      const started = subDays(now, 1);
      const contract = this.$store.getters["selectedContract/selectedContract"]
        .id;

      const shift = new Shift({
        started,
        stopped: now,
        contract,
        wasReviewed: true
      });

      this.$store
        .dispatch("contentData/saveShift", shift.toPayload())
        .then(() => {
          this.$store.dispatch("snackbar/setSnack", {
            message: "Debug: Overflowing shift created.",
            timePassed: 0,
            timeout: 4000,
            color: "success",
            show: true
          });
        });
    },
    veryLongShift() {
      const now = new Date();
      const started = subDays(now, 4);
      const contract = this.$store.getters["selectedContract/selectedContract"]
        .id;

      const shift = new Shift({
        started,
        stopped: now,
        contract,
        wasReviewed: true
      });

      this.$store
        .dispatch("contentData/saveShift", shift.toPayload())
        .then(() => {
          this.$store.dispatch("snackbar/setSnack", {
            message: "Debug: Very long shift created.",
            timePassed: 0,
            timeout: 4000,
            color: "success",
            show: true
          });
        });
    }
  }
};
</script>
