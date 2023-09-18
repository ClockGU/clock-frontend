<template>
  <v-card>
    <CardToolbar
      :title="$t('app.privacyagreement')"
      :logout-action="true"
    ></CardToolbar>
    <GdprCardText @checkbox-updated="updateValue"></GdprCardText>
    <GdprCardActions v-if="!disableActions" :value="value"></GdprCardActions>
  </v-card>
</template>

<script>
import CardToolbar from "@/components/cards/CardToolbar.vue";
import GdprCardText from "@/components/gdpr/agreement-components/GdprCardText.vue";
import GdprCardActions from "@/components/gdpr/agreement-components/GdprCardActions.vue";

export default {
  name: "GdprAgreementCard",
  components: { GdprCardActions, GdprCardText, CardToolbar },
  props: {
    disableActions: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data: () => ({
    value: false
  }),
  methods: {
    updateValue(e) {
      this.value = e;
      this.$emit("checkbox-updated", e);
    }
  }
};
</script>
