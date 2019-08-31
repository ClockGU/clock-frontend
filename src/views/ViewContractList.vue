<template>
  <v-container>
    <ContractListFrame>
      <FrameHooks
        slot-scope="{ contracts, methods: { fetchList }, status: { loading } }"
        @created="fetchList()"
      >
        <v-row>
          <ContractListCardSkeleton v-if="loading" />

          <template v-for="contract in contracts" v-else>
            <ContractListCard :key="contract.id" :contract="contract" />
          </template>
        </v-row>
      </FrameHooks>
    </ContractListFrame>

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
import ContractListFrame from "@/components/contracts/ContractListFrame";
import ContractListCard from "@/components/contracts/ContractListCard";
import ContractListCardSkeleton from "@/components/contracts/ContractListCardSkeleton";
import FrameHooks from "@/components/FrameHooks";

export default {
  name: "ViewContractList",
  components: {
    ContractListCard,
    ContractListCardSkeleton,
    ContractListFrame,
    FrameHooks
  }
};
</script>
