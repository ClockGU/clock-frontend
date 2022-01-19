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
      {{ $tc("models.contract", 2) }}
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
            <v-btn color="primary" @click="newContract">
              {{ $t("buttons.newEntity", { entity: $tc("models.contract") }) }}
            </v-btn>
          </v-col>
          <template v-for="(contract, i) in contracts">
            <v-col :key="contract.uuid" cols="12" md="6">
              <ContractListCard
                :key="contract.uuid"
                :data-cy="'contract-' + i"
                :contract="contract"
                @edit="editContract"
                @delete="destroy(contract.uuid)"
              />
            </v-col>
          </template>
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
    })
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
