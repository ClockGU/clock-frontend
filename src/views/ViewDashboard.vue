<template>
  <v-row>
    <v-col sm="12" md="6">
      <ContractListCardSelect :contract="contract" />
    </v-col>

    <v-col sm="12" md="6">
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
import ContractListCardSelect from "@/components/contracts/ContractListCardSelect";

export default {
  name: "ViewDashboard",
  components: {
    ContractListCardSelect
  },
  data() {
    return {
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
