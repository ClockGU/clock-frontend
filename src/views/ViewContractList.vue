<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="px-3 py-4">
            <h1 class="text-h5 sr-only"> 
              {{ $t("app.contracts") }}
            </h1>
            <div class="pl-3">
              <ContractFormDialog btn-color="primary"></ContractFormDialog>
            </div>
          </v-card-title>
          <v-divider></v-divider>
          <v-col cols="12">
            <div v-if="loading" class="text-center pa-8">
              <v-progress-circular
                indeterminate
                color="primary"
                :aria-label="$t('aria.contracts.loading')"
              ></v-progress-circular>
              <p aria-live="polite" class="sr-only">
                {{ $t("aria.contracts.loading") }}
              </p>
            </div>

            <ul v-if="!loading || ignoreLoading" class="pa-0">
              <li v-if="activeContracts.length > 0">
                <v-expansion-panels v-model="panel" flat focusable>
                  <v-expansion-panel v-model="panel" elevation="0">
                    <v-expansion-panel-title>
                      <h2 class="text-h6 font-weight-regular">
                        {{ $t("contracts.activeContracts") }} ({{
                          activeContracts.length
                        }})
                      </h2>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <v-container>
                        <v-row>
                          <v-col
                            v-for="(contract, i) in activeContracts"
                            :key="contract.uuid"
                            cols="12"
                            xl="4"
                            md="6"
                          >
                            <ContractListCard
                              :key="contract.id"
                              :data-cy="'contract-' + i"
                              :contract="contract"
                              class="ma-0"
                              @delete="destroy(contract.id)"
                            />
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </li>

              <li v-if="expiredContracts.length > 0">
                <v-expansion-panels flat focusable>
                  <v-expansion-panel>
                    <v-expansion-panel-title>
                      <h2 class="text-h6 font-weight-regular">
                        {{ $t("contracts.archived") }} ({{
                          expiredContracts.length
                        }})
                      </h2>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <v-container>
                        <v-row>
                          <v-col
                            v-for="(contract, i) in expiredContracts"
                            :key="contract.uuid"
                            cols="12"
                            xl="4"
                            md="6"
                          >
                            <ContractListCard
                              :key="contract.id"
                              :data-cy="'contract-' + i"
                              :contract="contract"
                              expired
                              class="ma-0"
                              @edit="editContract"
                              @delete="destroy(contract.id)"
                            />
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </li>
            </ul>
          </v-col>

          <placeholder
            v-if="(!loading || ignoreLoading) && contracts.length === 0"
            data-cy="contract-list-empty-placeholder"
            name="UndrawContentCreator"
          >
            {{ $t("contracts.empty") }}
          </placeholder>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ContractListCard from "@/components/contracts/ContractListCard.vue";
import { endOfDay, isPast } from "date-fns";

import { Contract } from "@/models/ContractModel";
import { ContractService } from "@/services/models";

import { mdiPlus } from "@mdi/js";

import { mapGetters } from "vuex";
import { log } from "@/utils/log";
import ContractFormDialog from "@/components/forms/dialogs/ContractFormDialog.vue";

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
      loading: false,
      panel: 0
    };
  },
  computed: {
    ...mapGetters({
      contracts: "contentData/allContracts",
      clockedShift: "clock/clockedShift"
    }),
    smAndDown() {
      return this.$vuetify.display.smAndDown;
    },
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

<style lang="css" scoped>
:deep(.v-expansion-panel-content__wrap) {
  padding-left: 0.75rem;
}
ul {
  list-style-type: none;
}
</style>