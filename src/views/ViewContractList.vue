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
            <ContractListCard
              :key="contract.uuid"
              :contract="contract"
              @delete="confirmDelete(contract.uuid, fetchList)"
            />
          </template>
        </v-row>
      </FrameHooks>
    </ContractListFrame>

    <TheDialog v-if="dialog">
      <template v-slot:content>
        <v-card>
          <v-card-title class="headline"
            >You sure you want to delete this contract?</v-card-title
          >
          <v-card-text>
            <p>
              This will delete all shifts created inside this contract. This
              action is not reversible.
            </p>
          </v-card-text>
          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn text @click="dialog = false">Cancel</v-btn>
            <v-btn color="error" text @click="destroy">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </TheDialog>

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
import ContractListCard from "@/components/contracts/ContractListCard";
import ContractListCardSkeleton from "@/components/contracts/ContractListCardSkeleton";
import ContractListFrame from "@/components/contracts/ContractListFrame";
import FrameHooks from "@/components/FrameHooks";
import TheDialog from "@/components/TheDialog";

import ContractService from "@/services/contract.service";

export default {
  name: "ViewContractList",
  components: {
    ContractListCard,
    ContractListCardSkeleton,
    ContractListFrame,
    FrameHooks,
    TheDialog
  },
  data() {
    return {
      dialog: false,
      contract: null,
      callback: null
    };
  },
  methods: {
    confirmDelete(uuid, callback) {
      this.uuid = uuid;
      this.dialog = true;
      this.callback = callback;
    },
    async destroy() {
      await ContractService.delete(this.uuid);
      await this.callback();

      this.dialog = false;
      this.uuid = null;
      this.callback = null;
    }
  }
};
</script>
