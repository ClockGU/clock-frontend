<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$vuetify.breakpoint.smAndDown"
    max-width="600"
    persistent
    no-click-animation
    @keydown.esc="closeDialog"
  >
    <v-card>
      <v-toolbar flat>
        <v-toolbar-title>
          {{ titles[step] }}
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <LanguageSwitcher />

        <v-btn text @click="logout">
          {{ $t("actions.logout") }}
        </v-btn>
      </v-toolbar>

      <v-card-text class="pb-0">
        <v-window v-model="step">
          <v-window-item :value="0">
            <placeholder name="UndrawSubway">
              {{ $t("onboarding.welcome.text") }}
            </placeholder>
          </v-window-item>

          <v-window-item :value="1">
            <placeholder name="UndrawWorkInProgress">
              {{ $t("onboarding.underConstruction.text") }}
            </placeholder>
          </v-window-item>

          <v-window-item :value="2">
            <v-card-text class="pb-0">
              <i18n path="privacyagreement.text" tag="p">
                <template #privacyAgreement>
                  <v-dialog v-model="privacyDialog" scrollable max-width="600">
                    <template #activator="{ on, attrs }">
                      <a v-bind="attrs" v-on="on">{{
                        $t("app.privacyagreement")
                      }}</a>
                    </template>
                    <v-card>
                      <v-toolbar
                        flat
                        class="text-h5 text--secondary font-weight-bold"
                      >
                        {{ $t("app.privacyagreement") }}
                        <v-spacer></v-spacer>
                        <v-toolbar-items>
                          <v-btn icon @click="privacyDialog = false">
                            <v-icon>{{ icons.mdiClose }}</v-icon>
                          </v-btn>
                        </v-toolbar-items>
                      </v-toolbar>
                      <v-card-text>
                        <Privacy :dialog="true"></Privacy>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          text
                          color="primary"
                          @click="privacyDialog = false"
                        >
                          {{ $t("actions.close") }}
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </template>
              </i18n>

              <v-checkbox
                v-model="privacyagreement"
                :label="$t('privacyagreement.checkbox')"
              >
              </v-checkbox>
            </v-card-text>
            <v-card-text> {{ $t("privacyagreement.revokeInfo") }} </v-card-text>
          </v-window-item>

          <v-window-item :value="3">
            <p>{{ $t("onboarding.createContract.text") }}</p>
            <ContractForm :entity="entity" @update="updateContractForm" />

            <h3 class="pb-2">
              {{ $t("personnelNumber.title") }}
            </h3>
            <span>
              {{ $t("personnelNumber.text") }}
            </span>
            <v-row align="center" justify="start">
              <v-col cols="12" md="12">
                <v-text-field
                  v-model="personnelNumber"
                  :label="$t('personnelNumber.label')"
                  :hint="$t('personnelNumber.hint')"
                  :prepend-icon="icons.mdiBadgeAccountHorizontal"
                  return-masked-value
                  persistent-hint
                  required
                  filled
                />
              </v-col>
            </v-row>
          </v-window-item>

          <v-window-item :value="4">
            <placeholder name="UndrawFinishLine">
              {{ $t("onboarding.finished.text") }}
            </placeholder>
          </v-window-item>
        </v-window>
      </v-card-text>

      <v-card-actions>
        <v-btn :disabled="step == 0" text @click="step--">
          {{ $t("actions.back") }}
        </v-btn>
        <v-spacer></v-spacer>

        <v-item-group v-model="step" class="text-center" mandatory>
          <v-item
            v-for="n in titles.length"
            :key="`btn-${n}`"
            v-slot="{ active, toggle }"
          >
            <v-btn :input-value="active" icon @click="toggle">
              <v-icon>{{ icons.mdiRecord }}</v-icon>
            </v-btn>
          </v-item>
        </v-item-group>

        <v-spacer></v-spacer>
        <v-btn
          v-if="step !== titles.length - 1"
          :disabled="
            (step === 3 && !contractFormValid) ||
            (step === 2 && !privacyagreement)
          "
          color="primary"
          text
          @click="step++"
        >
          {{ $t("actions.next") }}
        </v-btn>
        <v-btn v-else text color="primary" :loading="loading" @click="save">
          {{ $t("actions.complete") }}
        </v-btn>
      </v-card-actions>

      <FeedbackMenu />
    </v-card>
  </v-dialog>
</template>

<script>
import { log } from "@/utils/log";
import {
  mdiDelete,
  mdiBadgeAccountHorizontal,
  mdiClose,
  mdiRecord
} from "@mdi/js";

import ContractForm from "@/components/contracts/ContractForm";
import FeedbackMenu from "@/components/FeedbackMenu";
import Privacy from "@/views/Privacy";

import { ServiceFactory } from "@/factories/serviceFactory";
import AuthService from "@/services/auth";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default {
  name: "OnboardDialog",
  components: {
    ContractForm,
    LanguageSwitcher,
    FeedbackMenu,
    Privacy
  },
  props: {
    now: {
      type: Date,
      default: () => new Date()
    },
    entity: {
      type: Object || null,
      default: null
    },
    entityName: {
      type: String,
      default: "contract"
    }
  },
  data: () => ({
    step: 0,
    confirmDialog: false,
    contractFormValid: false,
    dialog: true,
    icons: {
      mdiBadgeAccountHorizontal,
      mdiDelete,
      mdiClose,
      mdiRecord
    },
    contractToSave: null,
    toSave: null,
    service: null,
    loading: false,
    personnelNumber: null,
    privacyagreement: false,
    privacyDialog: false
  }),
  computed: {
    serviceRepository() {
      return ServiceFactory.get(this.entityName);
    },
    titles() {
      return [
        this.$t("onboarding.welcome.title"),
        this.$t("onboarding.underConstruction.title"),
        this.$t("app.privacyagreement"),
        this.$t("onboarding.createContract.title", {
          entity: this.$tc("models.contract")
        }),
        this.$t("onboarding.finished.title")
      ];
    }
  },
  created() {
    // Load the entity service
    this.loadService();
    // Make a copy of the entity we will save.
    this.toSave = this.entity;
  },
  methods: {
    updateContractForm(event) {
      this.contractToSave = event[this.entityName];
      this.contractFormValid = event.valid;
    },
    loadService() {
      this.serviceRepository.serviceLoader().then((service) => {
        this.service = service["default"];
      });
    },
    closeDialog() {
      this.$emit("close");
    },
    logout() {
      this.$store.dispatch("auth/LOGOUT");
    },
    async save() {
      this.loading = true;
      try {
        const response = await this.service.create(
          this.contractToSave.toPayload()
        );
        const userData = { language: this.$i18n.locale };
        if (this.personnelNumber) {
          userData.personal_number = this.personnelNumber;
        }
        await AuthService.updateSettings(userData);
        const { uuid: contract } = response;
        await this.$store.dispatch("contract/queryContracts");
        await AuthService.updateSettings({
          onboarding_passed: true,
          dsgvo_accepted: true
        });
        await this.$store.dispatch("GET_USER");
        this.$router
          .push({ name: "dashboard", params: { contract } })
          .catch(() => {
            log("*** Redirecting...");
          });
      } catch (error) {
        // TODO: Set error state
        log(error);
      } finally {
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      }
    }
  }
};
</script>
