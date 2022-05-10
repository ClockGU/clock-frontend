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
        <v-btn text @click="closeOnboarding">
          <v-icon>
            {{ icons.mdiClose }}
          </v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="pb-0">
        <v-window v-model="step">
          <v-window-item
            v-for="(card, i) in Object.values($t('onboarding.cards'))"
            :key="card.title"
            :value="i"
          >
            <v-card-text>
              <placeholder :name="card.placeholderName">
                {{ card.text }}
              </placeholder>
            </v-card-text>
          </v-window-item>

          <v-window-item v-if="!dsgvoAccepted" key="privacy">
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
            <v-card-text>
              {{ $t("privacyagreement.revokeInfo") }}
            </v-card-text>
          </v-window-item>

          <v-window-item v-if="!contractExists" key="contractForm">
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

          <v-window-item key="finish">
            <placeholder name="UndrawFinishLine">
              {{ $t("onboarding.finished.text") }}
            </placeholder>
          </v-window-item>
        </v-window>
      </v-card-text>
      <v-progress-linear
        :value="(step / titles.length) * 100"
      ></v-progress-linear>
      <v-card-actions>
        <v-btn :disabled="step === 0" text @click="step--">
          {{ $t("actions.back") }}
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          v-if="
            step < titles.length - 2 ||
            (step === titles.length - 2 &&
              (!contractFormEmpty || contractExists))
          "
          color="primary"
          text
          :disabled="
            (!dsgvoAccepted &&
              !privacyagreement &&
              step === titles.length - (contractExists ? 2 : 3)) ||
            (!contractFormValid &&
              step === titles.length - 2 &&
              !contractExists)
          "
          @click="step++"
        >
          {{ $t("actions.next") }}
        </v-btn>
        <v-btn
          v-if="step === titles.length - 1"
          text
          color="primary"
          :loading="loading"
          @click="finishOnboarding"
        >
          {{ $t("actions.complete") }}
        </v-btn>
        <v-btn
          v-if="
            contractFormEmpty &&
            step === titles.length - (contractExists ? -1 : 2)
          "
          color="primary"
          text
          @click="step++"
        >
          {{ $t("actions.skip") }}
        </v-btn>
      </v-card-actions>
      <v-card-actions>
        <v-checkbox
          v-model="dontShowOnboardingAgain"
          :label="$t('actions.dontShowAgain')"
          style="scale: 0.85"
        ></v-checkbox>
      </v-card-actions>
      <v-dialog
        v-model="showAreYouSureDialog"
        :fullscreen="$vuetify.breakpoint.smAndDown"
        max-width="400"
      >
        <v-card>
          <v-card-title class="warning white--text">
            {{ $t("news.label.warning") }} !
          </v-card-title>
          <v-card-text style="padding: 20px">
            <p>
              {{ $t("dialogs.dataWillBeLost") }}
            </p>
          </v-card-text>
          <v-card-actions>
            <v-btn color="error" text @click="showAreYouSureDialog = false">
              {{ $t("actions.close") }}
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="success"
              text
              @click="
                contractFormEmpty = true;
                closeOnboarding();
              "
            >
              {{ $t("actions.continue") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
    contractFormEmpty: true,
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
    privacyDialog: false,
    dontShowOnboardingAgain: false,
    savedContractUuid: undefined,
    showAreYouSureDialog: false
  }),
  computed: {
    dsgvoAccepted() {
      return this.$store.state.user.dsgvo_accepted;
    },
    contractExists() {
      return this.$store.getters["contract/contracts"].length > 0;
    },
    serviceRepository() {
      return ServiceFactory.get(this.entityName);
    },
    titles() {
      let returnValue = Object.values(this.$t("onboarding.cards")).map(
        function (el) {
          return el.title;
        }
      );

      if (!this.dsgvoAccepted) {
        returnValue.push(this.$t("app.privacyagreement"));
      }
      if (!this.contractExists) {
        returnValue.push(
          this.$t("onboarding.createContract.title", {
            entity: this.$tc("models.contract")
          })
        );
      }

      returnValue.push(this.$t("onboarding.finished.title"));
      return returnValue;
    }
  },
  async created() {
    // Load the entity service
    this.loadService();
    // Make a copy of the entity we will save.
    this.toSave = this.entity;

    await this.$store.dispatch("contract/queryContracts");
  },
  methods: {
    updateContractForm(event) {
      this.contractToSave = event[this.entityName];
      this.contractFormValid = event.valid;
      this.contractFormEmpty = !(
        event.contract.name ||
        event.contract.worktime ||
        this.contractExists
      );
    },
    loadService() {
      this.serviceRepository.serviceLoader().then((service) => {
        this.service = service["default"];
      });
    },
    closeDialog() {
      this.$emit("close");
    },
    routeToDashboard() {
      this.$router
        .push({
          name: "dashboard",
          params: { contract: this.savedContractUuid }
        })
        .catch(() => {
          log("*** Redirecting...");
        });
    },
    async closeOnboarding() {
      // TODO: Not sure if this is the best way to identify user made input on the contract form.
      this.loading = true;
      if (!this.contractFormEmpty) {
        this.showAreYouSureDialog = true;
        return;
      }
      try {
        await this.$store.dispatch("skipOnboarding");
        await this.$store.dispatch("UPDATE_SETTINGS", {
          onboarding_passed: this.dontShowOnboardingAgain,
          dsgvo_accepted: this.privacyagreement || this.dsgvoAccepted
        });
        this.routeToDashboard();
      } finally {
        setTimeout(() => {
          this.loading = false;
        }, 2000);
      }
    },
    logout() {
      this.$store.dispatch("auth/LOGOUT");
    },
    async finishOnboarding() {
      this.loading = true;
      if (this.contractFormValid) {
        await this.save();
      }
      // Do this to prevent the areYouSureDialog
      this.contractFormEmpty = true;
      await this.closeOnboarding();
    },
    async save() {
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
        this.savedContractUuid = contract;
      } catch (error) {
        // TODO: Set error state
        log(error);
      }
    }
  }
};
</script>
