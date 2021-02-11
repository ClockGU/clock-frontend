<template>
  <v-hover>
    <template #default="{ hover }">
      <v-card
        class="mx-auto"
        max-width="350"
        outlined
        :elevation="hover ? 2 : 0"
        :disabled="disabled"
        @click="selectContract(contract)"
      >
        <v-card-title>
          <span class="primary--text text-subtitle-2">
            {{ contract.hours | hoursToWorktime }} per month
          </span>
        </v-card-title>

        <v-card-text>
          <h2 class="text-h6 primary-text">{{ contract.name }}</h2>
          {{ contract.date.start | toDate }} until
          {{ contract.date.end | toDate }}
        </v-card-text>
      </v-card>
    </template>
  </v-hover>
</template>

<script>
import { parseISO } from "date-fns";
import { localizedFormat } from "@/utils/date";

export default {
  name: "ContractListCardSelect",
  filters: {
    toDate(date) {
      return localizedFormat(parseISO(date), "yyyy-MM-dd");
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

      this.$router.push({ name: "dashboard" });
    }
  }
};
</script>
