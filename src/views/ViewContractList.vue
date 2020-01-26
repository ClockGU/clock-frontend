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

    <v-row v-if="loading" data-cy="contract-list">
      <v-col cols="12" sm="6" md="4">
        <v-skeleton-loader
          data-cy="skeleton"
          type="card"
          max-width="350"
          :loading="true"
        ></v-skeleton-loader>
      </v-col>
    </v-row>

    <v-row v-else>
      <template v-if="editMode">
        <template v-for="(contract, i) in contracts">
          <v-col :key="contract.uuid" cols="12" sm="6" md="4">
            <ContractListCard
              :key="contract.uuid"
              :data-cy="'contract-' + i"
              :contract="contract"
              :edit-mode="editMode"
              @delete="confirmDelete(contract.uuid)"
            />
          </v-col>
        </template>
      </template>

      <template v-else>
        <template v-for="(contract, i) in contracts">
          <v-col :key="contract.uuid" cols="12" sm="6" md="4">
            <ContractListCardSelect
              :data-cy="'contract-' + i"
              :contract="contract"
              :edit-mode="editMode"
              :disabled="clockedIntoContract(contract.uuid)"
            />
          </v-col>
        </template>
      </template>
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

    <portal to="fab">
      <v-btn
        absolute
        dark
        fab
        :top="$vuetify.breakpoint.mdAndUp"
        :bottom="$vuetify.breakpoint.smAndDown"
        right
        color="secondary"
        data-cy="contraxt-create-button"
        :to="{ name: 'createContract' }"
      >
        <v-icon>{{ icons.mdiPlus }}</v-icon>
      </v-btn>
    </portal>
  </v-container>
</template>

<script>
import ContractListCard from "@/components/contracts/ContractListCard";
import ContractListCardSelect from "@/components/contracts/ContractListCardSelect";
import TheDialog from "@/components/TheDialog";

import ContractService from "@/services/contract";

import { mdiPlus } from "@mdi/js";

import { mapGetters } from "vuex";
import { handleApiError } from "../utils/interceptors";

export default {
  name: "ViewContractList",
  components: {
    ContractListCard,
    ContractListCardSelect,
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
      loading: "contract/loading",
      contracts: "contract/contracts",
      clockedShift: "shift/clockedShift"
    }),
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
    clockedIntoContract(uuid) {
      if (this.clockedShift === undefined || this.clockedShift === null) {
        return false;
      }

      return this.clockedShift.contract !== uuid;
    },
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
