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

    <template #title>
      {{ $t("contracts.activeContracts") }} ({{ activeContracts.length }})
    </template>
    <template #content>
      <v-row :justify="loading && !ignoreLoading ? 'center' : 'start'">
        <v-col v-if="loading && !ignoreLoading" cols="10" md="6">
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
            <v-btn color="primary" class="ml-3" @click="newContract">
              {{ $t("buttons.newEntity", { entity: $tc("models.contract") }) }}
            </v-btn>
          </v-col>
          <template v-for="(contract, i) in activeContracts">
            <v-col :key="contract.uuid" cols="12" xl="4" md="6" justify="start">
              <ContractListCard
                :key="contract.uuid"
                :data-cy="'contract-' + i"
                :contract="contract"
                @edit="editContract"
                @delete="destroy(contract.uuid)"
              />
            </v-col>
          </template>

          <v-expansion-panels v-if="expiredContracts.length > 0" flat>
            <v-expansion-panel
              ><v-expansion-panel-header class="text-h6 font-weight-regular">
                {{ $t("contracts.archived") }} ({{ expiredContracts.length }})
              </v-expansion-panel-header>
              <v-expansion-panel-content
                ><v-row>
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
                          :key="contract.uuid"
                          :data-cy="'contract-' + i"
                          :contract="contract"
                          expired
                          @edit="editContract"
                          @delete="destroy(contract.uuid)"
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

    <template #extra-content>
      <FormDialog
        v-if="contractEntity !== null"
        entity-name="contract"
        :entity="contractEntity"
        @close="contractEntity = null"
        @refresh="refresh"
      />
    </template>
  </base-layout>
</template>

<script>
import ContractListCard from "@/components/contracts/ContractListCard";
import FormDialog from "@/components/FormDialog";
import { parseISO, endOfDay, isPast } from "date-fns";

import { Contract } from "@/models/ContractModel";
import ContractService from "@/services/contract";

import { mdiPlus } from "@mdi/js";

import { mapGetters } from "vuex";
import { log } from "@/utils/log";

export default {
  name: "ViewContractList",
  metaInfo() {
    return {
      title: this.$t("app.contracts")
    };
  },
  components: {
    ContractListCard,
    FormDialog
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
      ignoreLoading: false
    };
  },
  computed: {
    ...mapGetters({
      loading: "contract/loading",
      contracts: "contract/contracts",
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
    }
  },
  watch: {
    contracts() {
      if (this.contracts.length < 1) {
        // TODO change this again to a more sane solution
        window.location.reload();
      }
    }
  },
  methods: {
    async refresh() {
      try {
        await Promise.all([
          this.$store.dispatch("shift/queryShifts"),
          this.$store.dispatch("contract/queryContracts"),
          this.$store.dispatch("report/list")
        ]);
      } catch (error) {
        log(error);
      }
    },
    editContract(uuid) {
      const contract = this.contracts.find(
        (contract) => contract.uuid === uuid
      );
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
    contractExpired(contract) {
      const date = endOfDay(parseISO(contract.date.end));
      return isPast(date);
    },
    async destroy(uuid) {
      try {
        await ContractService.delete(uuid);
        this.$store.dispatch("contract/queryContracts");
      } catch (error) {
        // TODO: Set error state in component
        log(error);
      }
    }
  }
};
</script>
