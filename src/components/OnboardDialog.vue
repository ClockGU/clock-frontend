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
      <CardToolbar
        :title="titles[step]"
        close-action
        @close="closeOnboarding"
      ></CardToolbar>
      <v-card-text class="pb-0">
        <v-window v-model="step">
          <v-window-item
            v-for="(card, i) in Object.values($t('onboarding.cards'))"
            :key="i"
            :value="i"
            eager
          >
            <placeholder :name="card.placeholderName">
              {{ card.text }}
            </placeholder>
          </v-window-item>

          <v-window-item
            v-if="!dsgvoAccepted"
            key="privacy"
            :value="titles.length - (contractExists ? 2 : 3)"
          >
            <GdprAgreementCard
              disable-actions
              @checkbox-updated="updatePrivacyagreement"
            ></GdprAgreementCard>
          </v-window-item>

          <v-window-item
            v-if="!contractExists"
            key="contractForm"
            eager
            :value="titles.length - 2"
          >
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

          <v-window-item key="finish" eager :value="titles.length - 1">
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
import GdprAgreementCard from "@/components/gdpr/GdprAgreementCard";
import CardToolbar from "@/components/cards/CardToolbar";

import { ServiceFactory } from "@/factories/serviceFactory";

export default {
  name: "OnboardDialog",
  components: {
    ContractForm,
    FeedbackMenu,
    GdprAgreementCard,
    CardToolbar
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
    contractExists: false,
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
    dontShowOnboardingAgain: false,
    savedContractUuid: undefined,
    showAreYouSureDialog: false,
    dsgvoAccepted: false
  }),
  computed: {
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
    this.contractExists =
      this.$store.getters["contentData/allContracts"].length > 0;
    this.dsgvoAccepted = this.$store.state.user.dsgvo_accepted;
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
    updatePrivacyagreement(e) {
      this.privacyagreement = e;
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
        let userData = {
          onboarding_passed: this.dontShowOnboardingAgain,
          dsgvo_accepted: this.privacyagreement || this.dsgvoAccepted,
          language: this.$i18n.locale
        };
        if (this.personnelNumber !== null) {
          userData.personal_number = this.personnelNumber;
        }
        await this.$store.dispatch("UPDATE_SETTINGS", userData);
        this.routeToDashboard();
      } finally {
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      }
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
