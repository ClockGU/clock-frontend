<template>
  <v-card>
    <CardToolbar
      :title="$t('app.privacyagreement')"
      :logout-action="true"
    ></CardToolbar>
    <GdprCardText @checkbox-updated="updateValue"></GdprCardText>
    <GdprCardActions :value="value"></GdprCardActions>
  </v-card>
</template>

<script>
import CardToolbar from "@/components/cards/CardToolbar";
import GdprCardText from "@/components/gdpr/agreement-components/GdprCardText";
import GdprCardActions from "@/components/gdpr/agreement-components/GdprCardActions";

export default {
  name: "GdprAgreementCard",
  components: { GdprCardActions, GdprCardText, CardToolbar },
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
