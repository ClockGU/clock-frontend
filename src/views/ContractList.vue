<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <template v-for="contract in contracts">
        <v-flex xs6 :key="contract.uuid">
          <v-card color="blue-grey darken-2" class="white--text">
            <v-card-title primary-title>
              <div class="headline">{{ contract.name }}</div>
            </v-card-title>
            <v-card-text>
              <p>
                Start: {{ contract.date.start | toDate }}
                <br />
                End: {{ contract.date.end | toDate }}
                <br />
                Hours: {{ contract.hours }}
              </p>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                flat
                dark
                :to="{ name: 'editContract', params: { uuid: contract.uuid } }"
                >Edit</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-flex>
      </template>
    </v-layout>

    <portal to="fab">
      <v-btn
        absolute
        dark
        fab
        top
        right
        color="pink"
        :to="{ name: 'createContract' }"
      >
        <v-icon>add</v-icon>
      </v-btn>
    </portal>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import { format } from "date-fns";

export default {
  name: "ContractList",
  computed: {
    ...mapState({
      contracts: state => state.contract.contracts
    })
  },
  filters: {
    toDate(date) {
      return format(date, "YYYY-MM-DD");
    }
  }
};
</script>
