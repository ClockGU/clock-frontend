<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>
          <template v-if="!editMode">
            Who is paying?
          </template>
          <template v-else>
            Contracts
          </template>
        </h1>
      </v-col>
    </v-row>

    <ContractListFrame>
      <FrameHooks
        slot-scope="{ contracts, methods: { fetchList }, status: { loading } }"
        @created="fetchList()"
      >
        <v-row>
          <ContractListCardSkeleton v-if="loading" :edit-mode="editMode" />

          <template v-for="contract in contracts" v-else>
            <ContractListCard
              :key="contract.uuid"
              :contract="contract"
              :edit-mode="editMode"
              @delete="confirmDelete(contract.uuid, fetchList)"
            />
          </template>

          <v-col cols="12" sm="6" md="4">
            <v-hover>
              <template v-slot:default="{ hover }">
                <v-card
                  class="mx-auto"
                  :min-height="editMode ? '170px' : '118px'"
                  :to="{ name: 'createContract' }"
                  :elevation="hover ? 2 : 0"
                  max-width="350"
                  outlined
                  @click="() => {}"
                >
                  <v-row :style="{ height: editMode ? '168px' : '116px' }">
                    <v-col align-self="center" align="center">
                      <v-btn text disabled>
                        <v-icon left>add</v-icon> Add contract
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card>
              </template>
            </v-hover>
          </v-col>
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
      callback: null,
      hover: false
    };
  },
  computed: {
    editMode() {
      if (this.$route.name === "contractSelect") return false;

      return true;
    }
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
