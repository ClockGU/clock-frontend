<template>
  <v-row
    :align="$vuetify.breakpoint.mdAndUp ? 'center' : null"
    :justify="$vuetify.breakpoint.mdAndUp ? 'center' : null"
  >
    <v-col cols="12" md="6" class="py-0">
      <v-card :elevation="$vuetify.breakpoint.smAndDown ? 0 : null">
        <portal-target name="card-toolbar"></portal-target>

        <portal
          :to="$vuetify.breakpoint.smAndDown ? 'app-bar' : 'card-toolbar'"
        >
          <v-toolbar slot-scope="{ action }" :elevation="0">
            <v-app-bar-nav-icon
              v-if="$vuetify.breakpoint.smAndDown"
              icon
              @click="action"
            ></v-app-bar-nav-icon>

            <v-toolbar-title>
              {{ editMode ? "Contracts" : "Select a contract" }}
            </v-toolbar-title>
          </v-toolbar>
        </portal>

        <v-card-text>
          <v-row :justify="loading ? 'center' : 'start'">
            <v-col v-if="loading" cols="10" md="6">
              <v-skeleton-loader
                v-if="loading"
                data-cy="skeleton"
                type="card"
                width="90%"
                :loading="true"
              ></v-skeleton-loader>
            </v-col>

            <template v-if="!loading && editMode">
              <template v-for="(contract, i) in contracts">
                <v-col :key="contract.uuid" cols="12" md="6">
                  <ContractListCard
                    :key="contract.uuid"
                    :data-cy="'contract-' + i"
                    :contract="contract"
                    :edit-mode="editMode"
                    @edit="editContract"
                    @delete="confirmDelete(contract.uuid)"
                  />
                </v-col>
              </template>
            </template>

            <template v-if="!loading && !editMode">
              <template v-for="(contract, i) in contracts">
                <v-col :key="contract.uuid" cols="12" md="6">
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
        </v-card-text>
      </v-card>
    </v-col>

    <TheDialog v-if="dialog" @close="dialog = false">
      <template v-slot:content>
        <v-card data-cy="delete-dialog" class="mx-auto">
          <v-card-title class="headline">
            Delete contract?
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

    <ContractFormDialog
      v-if="contractEntity !== null"
      :contract-entity="contractEntity"
      @close="contractEntity = null"
      @refresh="refresh"
    />

    <TheFAB :to="null" :click="newContract" />
  </v-row>
</template>

<script>
import ContractListCard from "@/components/contracts/ContractListCard";
import ContractListCardSelect from "@/components/contracts/ContractListCardSelect";
import ContractFormDialog from "@/components/contracts/ContractFormDialog";
import TheDialog from "@/components/TheDialog";
import TheFAB from "@/components/TheFAB";

import { Contract } from "@/models/ContractModel";
import ContractService from "@/services/contract";

import { mdiPlus } from "@mdi/js";

import { mapGetters } from "vuex";
import { handleApiError } from "../utils/interceptors";

export default {
  name: "ViewContractList",
  components: {
    ContractListCard,
    ContractListCardSelect,
    ContractFormDialog,
    TheDialog,
    TheFAB
  },
  data() {
    return {
      dialog: false,
      icons: {
        mdiPlus: mdiPlus
      },
      contractEntity: null
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
    this.refresh();
  },
  methods: {
    refresh() {
      this.$store.dispatch("shift/queryShifts");
      this.$store.dispatch("contract/queryContracts");
    },
    editContract(uuid) {
      const contract = this.contracts.find(contract => contract.uuid === uuid);
      this.contractEntity = new Contract(contract);
    },
    newContract() {
      this.contractEntity = new Contract();
    },
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
