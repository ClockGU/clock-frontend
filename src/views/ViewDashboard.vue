<template>
  <v-row>
    <v-col sm="12" md="4">
      <ContractListCardSelect :contract="contract" />
    </v-col>

    <v-col sm="12" md="4">
      <v-sparkline
        fill
        :gradient="gradient"
        :padding="padding"
        :smooth="radius || false"
        :value="value"
        auto-draw
      ></v-sparkline>
    </v-col>

    <v-col sm="12" md="4">
      <v-card>
        <v-card-title>Last shifts</v-card-title>

        <v-card-text>
          <v-list v-for="i in [1, 2, 3]" :key="i" dense>
            <v-list-item @click="() => {}">ABC</v-list-item>
          </v-list>
        </v-card-text>

        <v-card-actions>
          <v-btn color="primary" text @click="() => {}">Show more</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
const gradients = [
  ["#222"],
  ["#42b3f4"],
  ["red", "orange", "yellow"],
  ["purple", "violet"],
  ["#00c6ff", "#F0F", "#FF0"],
  ["#f72047", "#ffd200", "#1feaea"]
];

import ContractListCardSelect from "@/components/contracts/ContractListCardSelect";

export default {
  name: "ViewDashboard",
  components: {
    ContractListCardSelect
  },
  data() {
    return {
      gradient: gradients[5],
      gradients,
      padding: 8,
      radius: 10,
      value: [0, 2, 5, 9, 5, 10, 3, 5, 0, 0, 1, 8, 2, 9, 0],
      contract: {
        uuid: "42ea6ef5-298d-49ae-9b90-003db528784d",
        name: "Der Vertrag",
        date: { start: "2019-09-01", end: "2019-09-30" },
        hours: 44.73
      }
    };
  }
};
</script>
