<template>
  <base-layout alternative-portal-target="card-toolbar">
    <template #card-top>
      <portal-target name="card-toolbar"></portal-target>
    </template>

    <template #pre-toolbar-title="{ action }">
      <v-app-bar-nav-icon
        v-if="$vuetify.breakpoint.smAndDown"
        icon
        @click="action"
      ></v-app-bar-nav-icon>
    </template>

    <template #title>{{ activeContractsTitle }}</template>
    <template #content>
      <v-row :justify="loading && !ignoreLoading ? 'center' : 'start'">
        <v-col v-if="loading && !ignoreLoading" cols="12" md="6">
          <v-skeleton-loader
            v-if="loading"
            data-cy="skeleton"
            type="card"
            width="90%"
            :loading="true"
          ></v-skeleton-loader>
        </v-col>

        <template v-if="!loading || ignoreLoading">
          <v-col cols="12">
            <div class="pl-3">
              <ContractFormDialog btn-color="primary"></ContractFormDialog>
            </div>
          </v-col>
          <template v-for="(contract, i) in activeContracts">
            <v-col :key="contract.id" cols="12" xl="4" md="6">
              <ContractListCard
                :key="contract.id"
                :data-cy="'contract-' + i"
                :contract="contract"
                @delete="destroy(contract.id)"
              />
            </v-col>
          </template>

          <v-expansion-panels v-if="expiredContracts.length > 0" flat focusable>
            <v-expansion-panel>
              <v-expansion-panel-header class="text-h6 font-weight-regular">
                {{ $t("contracts.archived") }} ({{ expiredContracts.length }})
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row>
                  <template v-if="!loading || ignoreLoading">
                    <template v-for="(contract, i) in expiredContracts">
                      <v-col
                        :key="contract.uuid"
                        cols="12"
                        xl="4"
                        md="6"
                        justify="start"
                      >
                        <ContractListCard
                          :key="contract.id"
                          :data-cy="'contract-' + i"
                          :contract="contract"
                          expired
                          @edit="editContract"
                          @delete="destroy(contract.id)"
                        />
                      </v-col>
                    </template>
                  </template> </v-row
              ></v-expansion-panel-content> </v-expansion-panel
          ></v-expansion-panels>
        </template>
      </v-row>

      <placeholder
        v-if="(!loading || ignoreLoading) && contracts.length === 0"
        data-cy="contract-list-empty-placeholder"
        name="UndrawContentCreator"
      >
        {{ $t("contracts.empty") }}
      </placeholder>
    </template>
  </base-layout>
</template>

<script>
import ContractListCard from "@/components/contracts/ContractListCard";
import { endOfDay, isPast } from "date-fns";

import { Contract } from "@/models/ContractModel";
import { ContractService } from "@/services/models";

import { mdiPlus } from "@mdi/js";

import { mapGetters } from "vuex";
import { log } from "@/utils/log";
import ContractFormDialog from "@/components/forms/dialogs/ContractFormDialog";

export default {
  name: "ViewContractList",
  metaInfo() {
    return {
      title: this.$t("app.contracts")
    };
  },
  components: {
    ContractFormDialog,
    ContractListCard
  },
  beforeRouteLeave(to, from, next) {
    this.ignoreLoading = true;

    next();
  },
  data() {
    return {
      dialog: false,
      icons: {
        mdiPlus: mdiPlus
      },
      contractEntity: null,
      ignoreLoading: false,
      // TODO: Build Loading functionality
      loading: false
    };
  },
  computed: {
    ...mapGetters({
      contracts: "contentData/allContracts",
      clockedShift: "clock/clockedShift"
    }),
    activeContracts() {
      return this.contracts.filter(
        (contract) => !this.contractExpired(contract)
      );
    },
    expiredContracts() {
      return this.contracts.filter((contract) =>
        this.contractExpired(contract)
      );
    },
    activeContractsTitle() {
      return this.activeContracts.length > 0
        ? this.$t("contracts.activeContracts")
        : this.$t("contracts.noActiveContracts");
    }
  },
  methods: {
    editContract(uuid) {
      const contract = this.contracts.find(
        (contract) => contract.uuid === uuid
      );
      this.contractEntity = new Contract(contract);
    },
    clockedIntoContract(uuid) {
      if (this.clockedShift === undefined || this.clockedShift === null) {
        return false;
      }

      return this.clockedShift.contract !== uuid;
    },
    contractExpired(contract) {
      const date = endOfDay(contract.endDate);
      return isPast(date);
    },
    async destroy(uuid) {
      try {
        if (uuid === this.$store.getters["contract/selectedContract"]) {
          await this.$store.dispatch("contract/clearSelectedContract");
        }
        await ContractService.delete(uuid);
        await this.$store.dispatch("contract/queryContracts");
      } catch (error) {
        // TODO: Set error state in component
        log(error);
      }
    }
  }
};
</script>
