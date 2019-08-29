<template>
  <v-content>
    <v-layout wrap>
      <ContractListFrame>
        <FrameHooks
          slot-scope="{
            contracts,
            methods: { fetchList },
            status: { loading, error }
          }"
          @created="fetchList()"
        >
          <v-container>
            <span v-if="loading">Loading...</span>
            <span v-else-if="error">Error while fetching data!</span>

            <template v-for="contract in contracts" v-else>
              <v-flex :key="contract.uuid" xs6>
                <v-card color="blue darken-2" class="white--text">
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
                      text
                      dark
                      :to="{
                        name: 'editContract',
                        params: { uuid: contract.uuid }
                      }"
                      >Edit</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-flex>
            </template>
          </v-container>
        </FrameHooks>
      </ContractListFrame>
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
  </v-content>
</template>

<script>
import { format } from "date-fns";

import ContractListFrame from "@/components/contracts/ContractListFrame";
import FrameHooks from "@/components/FrameHooks";

export default {
  name: "ViewContractList",
  components: { ContractListFrame, FrameHooks },
  filters: {
    toDate(date) {
      return format(date, "YYYY-MM-DD");
    }
  }
};
</script>
