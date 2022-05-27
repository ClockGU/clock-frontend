<template>
  <v-card>
    <CardToolbar
      :title="$t('app.privacyagreement')"
      :logout-action="true"
    ></CardToolbar>
    <GdprCardText @checkbox-updated="updateValue"></GdprCardText>
    <GdprCardActions :value="value"></GdprCardActions>
    <FeedbackMenu />
  </v-card>
</template>

<script>
import FeedbackMenu from "@/components/FeedbackMenu";
import CardToolbar from "@/components/cards/CardToolbar";
import GdprCardText from "@/components/gdpr/GdprCardText";
import GdprCardActions from "@/components/gdpr/GdprCardActions";

export default {
  name: "GdprAgreementCard",
  components: { FeedbackMenu, GdprCardActions, GdprCardText, CardToolbar },
  data: () => ({
    value: false
  }),
  methods: {
    updateValue(e) {
      this.value = e;
    }
  }
};
</script>
