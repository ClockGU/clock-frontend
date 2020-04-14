<template>
  <base-layout
    alternative-portal-target="card-toolbar"
    col-classes="py-0"
    :card-elevation="$vuetify.breakpoint.smAndDown ? 0 : null"
  >
    <template v-slot:card-top>
      <portal-target name="card-toolbar"></portal-target>
    </template>

    <template v-slot:pre-toolbar-title="{ action }">
      <v-app-bar-nav-icon
        v-if="$vuetify.breakpoint.smAndDown"
        icon
        @click="action"
      ></v-app-bar-nav-icon>
    </template>

    <template v-slot:title>
      {{ editMode ? "Contracts" : "Select a contract" }}
    </template>

    <template v-slot:content>
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
                @delete="destroy(contract.uuid)"
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

      <placeholder
        v-if="!loading && contracts.length === 0"
        data-cy="contract-list-empty-placeholder"
        component="UndrawContentCreator"
      >
        Start using Clock by creating your first contract!
      </placeholder>
    </template>

    <template v-slot:extra-content>
      <ContractFormDialog
        v-if="contractEntity !== null"
        :contract-entity="contractEntity"
        @close="contractEntity = null"
        @refresh="refresh"
      />

      <the-fab :to="null" :click="newContract" />
    </template>
  </base-layout>
</template>

<script>
import ContractListCard from "@/components/contracts/ContractListCard";
import ContractListCardSelect from "@/components/contracts/ContractListCardSelect";
import ContractFormDialog from "@/components/contracts/ContractFormDialog";

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
    ContractFormDialog
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
      clockedShift: "clock/clockedShift"
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
    async destroy(uuid) {
      ContractService.delete(uuid)
        .then(() => {
          if (uuid === this.$store.state.selectedContract.uuid) {
            this.$store.dispatch("unsetContract");
            this.$router.push({ name: "contractSelect" });
          }
        })
        .catch(handleApiError)
        .finally(() => {
          this.$store.dispatch("contract/queryContracts");
        });
    }
  }
};
</script>
