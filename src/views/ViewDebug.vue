<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>Debug</h1>
      </v-col>
    </v-row>

    <v-card>
      <SelectContractFilter
        :contracts="contracts"
        :selected-contract="selectedContract"
      />
    </v-card>

    <v-card>
      <v-card-title> Short shift </v-card-title>

      <v-card-text>
        Create a short shift, that is exactly 5 minutes long. Will prompt the
        "short shift warning".
      </v-card-text>

      <v-card-actions>
        <v-btn color="primary" text @click="shortShift">Create</v-btn>
      </v-card-actions>
    </v-card>

    <v-card>
      <v-card-title> Overflow shift </v-card-title>

      <v-card-text>
        Create a overflow shift, that starts on one day and ends on the other.
        Will prompt the "shift split warning".
      </v-card-text>

      <v-card-actions>
        <v-btn color="primary" text @click="overflowShift">Create</v-btn>
      </v-card-actions>
    </v-card>

    <v-card>
      <v-card-title> Very long shift </v-card-title>

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
import SelectContractFilter from "@/components/SelectContractFilter";

import { mapGetters } from "vuex";

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
  computed: {
    ...mapGetters({
      contracts: "contract/contracts"
    }),
    selectedContract() {
      const uuid = this.$route.params.contract;

      return this.contracts.find((contract) => contract.uuid === uuid);
    }
  },
  methods: {
    shortShift() {
      const now = new Date();
      const started = subMinutes(now, 5);
      const contract = this.selectedContract.uuid;

      const shift = { started, contract };

      this.$store.dispatch("clock/CLOCK_SHIFT", { ...shift }).then(() => {
        this.$store.dispatch("snackbar/setSnack", {
          snack: "Debug: done.",
          timeout: 4000,
          color: "success"
        });
      });
    },
    overflowShift() {
      const now = new Date();
      const started = subDays(now, 1);
      const contract = this.selectedContract.uuid;

      const shift = { started, contract };

      this.$store.dispatch("clock/CLOCK_SHIFT", { ...shift }).then(() => {
        this.$store.dispatch("snackbar/setSnack", {
          snack: "Debug: done.",
          timeout: 4000,
          color: "success"
        });
      });
    },
    veryLongShift() {
      const now = new Date();
      const started = subDays(now, 4);
      const contract = this.selectedContract.uuid;

      const shift = { started, contract };

      this.$store.dispatch("clock/CLOCK_SHIFT", { ...shift }).then(() => {
        this.$store.dispatch("snackbar/setSnack", {
          snack: "Debug: done.",
          timeout: 4000,
          color: "success"
        });
      });
    }
  }
};
</script>
