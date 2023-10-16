<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="smAndDown"
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
            v-for="(card, i) in Object.values($tm('onboarding.cards'))"
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
            :value="titles.length - 3"
          >
            <GdprAgreementCard
              v-model="privacyagreement"
              hide-toolbar
              disable-actions
            ></GdprAgreementCard>
          </v-window-item>

          <v-window-item key="contractForm" eager :value="titles.length - 2">
            <p>{{ $t("onboarding.setupData.text") }}</p>
            <v-row>
              <v-col cols="12">
                <h3 class="pb-2">
                  {{ $t("contracts.createContract") }}
                </h3>
                <span v-if="contractExists">
                  {{ $t("onboarding.setupData.contractExists") }}
                </span>
                <span v-else>
                  {{ $t("onboarding.setupData.noContractExists") }}
                </span>
                <br />

                <ContractFormDialog
                  btn-color="primary"
                  text-button
                  :override-button-text="
                    $t('buttons.newEntity', {
                      entity: $tc('models.contract')
                    })
                  "
                  :disabled="contractExists"
                ></ContractFormDialog>
              </v-col>
            </v-row>
            <v-row class="mb-2">
              <v-col cols="12">
                <h3 class="pb-2">
                  {{ $t("personnelNumber.title") }}
                </h3>
                <span v-if="personnelNumber">
                  {{ $t("personnelNumber.personnelNumberSaved") }}
                </span>
                <span v-else>
                  {{ $t("personnelNumber.noPersonnelNumberSaved") }}
                </span>
                <br />
                <v-btn
                  color="primary"
                  text
                  :disabled="personnelNumber !== ''"
                  @click="personnelNumberDialog = true"
                >
                  {{
                    $t("buttons.newEntity", {
                      entity: $tc("personnelNumber.label")
                    })
                  }}
                </v-btn>
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
        height="4"
        bg-color="primary"
        color="primary"
        bg-opacity="0.3"
        :model-value="(step / titles.length) * 100"
      ></v-progress-linear>
      <v-card-actions>
        <v-btn :disabled="step === 0" variant="text" @click="step--">
          {{ $t("actions.back") }}
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          v-if="step < titles.length - 1"
          color="primary"
          variant="text"
          :disabled="
            !dsgvoAccepted && !privacyagreement && step === titles.length - 3
          "
          @click="step++"
        >
          {{ $t("actions.next") }}
        </v-btn>
        <v-btn
          v-if="step === titles.length - 1"
          variant="text"
          color="primary"
          :loading="loading"
          @click="finishOnboarding"
        >
          {{ $t("actions.complete") }}
        </v-btn>
      </v-card-actions>
      <v-card-actions>
        <v-checkbox
          v-model="dontShowOnboardingAgain"
          density="compact"
          :label="$t('actions.dontShowAgain')"
          style="scale: 0.85"
        ></v-checkbox>
      </v-card-actions>
      <v-dialog
        v-model="showAreYouSureDialog"
        :fullscreen="smAndDown"
        max-width="600"
      >
        <v-card>
          <v-card-title class="bg-warning text-white">
            {{ $t("news.label.warning") }} !
          </v-card-title>
          <v-card-text style="padding: 20px">
            <p>
              {{ $t("dialogs.dataWillBeLost") }}
            </p>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="error"
              variant="text"
              @click="showAreYouSureDialog = false"
            >
              {{ $t("actions.close") }}
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="success" variant="text" @click="closeOnboarding()">
              {{ $t("actions.continue") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="personnelNumberDialog"
        :max-width="900"
        @click:outside="personnelNumberDialog = false"
        ><PersonnelNumberForm dialog @close="personnelNumberDialog = false"
      /></v-dialog>
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

import GdprAgreementCard from "@/components/gdpr/GdprAgreementCard.vue";
import CardToolbar from "@/components/cards/CardToolbar.vue";
import ContractFormDialog from "@/components/forms/dialogs/ContractFormDialog.vue";
import PersonnelNumberForm from "@/components/PersonnelNumberForm.vue";
import { mapGetters } from "vuex";
import { useDisplay } from "vuetify";

export default {
  name: "OnboardDialog",
  components: {
    PersonnelNumberForm,
    ContractFormDialog,
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
    privacyagreement: false,
    dontShowOnboardingAgain: false,
    savedContractUuid: undefined,
    showAreYouSureDialog: false,
    dsgvoAccepted: false,
    personnelNumberDialog: false
  }),
  computed: {
    ...mapGetters({
      personnelNumber: "personnelNumber"
    }),
    smAndDown() {
      const { smAndDown } = useDisplay();
      return smAndDown.value;
    },
    titles() {
      let returnValue = Object.values(this.$tm("onboarding.cards")).map(
        function (el) {
          return el.title;
        }
      );

      if (!this.dsgvoAccepted) {
        returnValue.push(this.$t("app.privacyagreement"));
      }

      returnValue.push(this.$t("onboarding.setupData.title"));
      returnValue.push(this.$t("onboarding.finished.title"));
      return returnValue;
    },
    contractExists() {
      return this.$store.getters["contentData/allContracts"].length > 0;
    }
  },
  async created() {
    // Make a copy of the entity we will save.
    this.dsgvoAccepted = this.$store.state.user.dsgvo_accepted;
  },
  methods: {
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
      this.loading = true;
      try {
        await this.$store.dispatch("skipOnboarding");
        let userData = {
          onboarding_passed: this.dontShowOnboardingAgain,
          dsgvo_accepted: this.privacyagreement || this.dsgvoAccepted
        };
        if (this.personnelNumber !== null) {
          userData.personal_number = this.personnelNumber;
        }
        await this.$store.dispatch("UPDATE_SETTINGS", userData);
        // if a user creates a Contract, Reports will be created so we need to fetch the data again on dashboard enter
        await this.$store.commit("contentData/unsetContentDataInitialized");
        this.routeToDashboard();
      } finally {
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      }
    },
    async finishOnboarding() {
      await this.closeOnboarding();
    }
  }
};
</script>
