<template>
  <v-hover>
    <template v-slot:default="{ hover }">
      <v-card
        class="mx-auto"
        max-width="350"
        outlined
        :elevation="hover ? 2 : 0"
        :disabled="disabled"
        @click="selectContract(contract)"
      >
        <v-card-title>
          <span class="primary--text subtitle-2">
            {{ contract.hours | hoursToWorktime }} per month
          </span>
        </v-card-title>

        <v-card-text>
          <h2 class="title primary-text">{{ contract.name }}</h2>
          {{ contract.date.start | toDate }} until
          {{ contract.date.end | toDate }}
        </v-card-text>
      </v-card>
    </template>
  </v-hover>
</template>

<script>
import { format, parseISO } from "date-fns";

export default {
  name: "ContractListCardSelect",
  filters: {
    toDate(date) {
      return format(parseISO(date), "yyyy-MM-dd");
    },
    hoursToWorktime(value) {
      const hours = Math.floor(value);
      const minutes = parseInt((60 * (value - hours)).toFixed(0));

      return `${hours.pad(2)}:${minutes.pad(2)}`;
    }
  },
  props: {
    contract: {
      type: Object,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    selectContract(contract) {
      this.$store.dispatch("setContract", contract);

      this.$router.push({ name: "c" });
    }
  }
};
</script>
