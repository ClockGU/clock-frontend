<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>
          <template v-if="!editMode">
            Select a contract
          </template>
          <template v-else>
            Contracts
          </template>
        </h1>
      </v-col>
    </v-row>

    <v-row data-cy="contract-list">
      <template v-if="editMode">
        <ContractListCardSkeleton v-if="loading" />

        <template v-for="(contract, i) in contracts" v-else>
          <ContractListCard
            :key="contract.uuid"
            :data-cy="'contract-' + i"
            :contract="contract"
            :edit-mode="editMode"
            @delete="confirmDelete(contract.uuid)"
          />
        </template>
      </template>

      <template v-else>
        <ContractListCardSelectSkeleton v-if="loading" />

        <template v-for="contract in contracts" v-else>
          <ContractListCardSelect
            :key="contract.uuid"
            :contract="contract"
            :edit-mode="editMode"
          />
        </template>
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
                    <v-icon left>{{ icons.mdiPlus }}</v-icon> Add contract
                  </v-btn>
                </v-col>
              </v-row>
            </v-card>
          </template>
        </v-hover>
      </v-col>
    </v-row>

    <TheDialog v-if="dialog" @close="dialog = false">
      <template v-slot:content>
        <v-card data-cy="delete-dialog" class="mx-auto">
          <v-card-title class="headline">
            You sure you want to delete this contract?
          </v-card-title>
          <v-card-text>
            This will delete all shifts created inside this contract. This
            action is not reversible.
          </v-card-text>
          <v-card-actions>
            <v-btn data-cy="delete-confirm" color="error" text @click="destroy">
              Delete
            </v-btn>
            <v-btn data-cy="delete-cancel" text @click="dialog = false">
              Cancel
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </TheDialog>
  </v-container>
</template>

<script>
import ContractListCard from "@/components/contracts/ContractListCard";
import ContractListCardSkeleton from "@/components/contracts/ContractListCardSkeleton";
import ContractListCardSelect from "@/components/contracts/ContractListCardSelect";
import ContractListCardSelectSkeleton from "@/components/contracts/ContractListCardSelectSkeleton";
import TheDialog from "@/components/TheDialog";

import ContractService from "@/services/contract";

import { mdiPlus } from "@mdi/js";

import { mapGetters } from "vuex";
import { handleApiError } from "../utils/interceptors";

export default {
  name: "ViewContractList",
  components: {
    ContractListCard,
    ContractListCardSkeleton,
    ContractListCardSelect,
    ContractListCardSelectSkeleton,
    TheDialog
  },
  data() {
    return {
      dialog: false,
      icons: {
        mdiPlus: mdiPlus
      }
    };
  },
  computed: {
    ...mapGetters({
      loading: "contract/loading"
    }),
    contracts() {
      return this.$store.state.contract.contracts;
    },
    editMode() {
      if (this.$route.name === "contractSelect") return false;

      return true;
    }
  },
  mounted() {
    this.$store.dispatch("shift/queryShifts");
    this.$store.dispatch("contract/queryContracts");
  },
  methods: {
    confirmDelete(uuid) {
      this.uuid = uuid;
      this.dialog = true;
    },
    async destroy() {
      ContractService.delete(this.uuid)
        .then(() => {
          if (this.uuid === this.$store.state.selectedContract.uuid) {
            this.$store.dispatch("unsetContract");
            this.$router.push({ name: "contractSelect" });
          }
        })
        .catch(handleApiError)
        .finally(() => {
          this.$store.dispatch("contract/queryContracts");

          this.dialog = false;
          this.uuid = null;
        });
    }
  }
};
</script>
