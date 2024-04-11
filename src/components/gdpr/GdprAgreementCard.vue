<template>
  <v-card>
    <CardToolbar
      v-if="!hideToolbar"
      color="background"
      :title="$t('app.privacyagreement')"
      :logout-action="true"
    ></CardToolbar>
    <GdprCardText
      v-model="value"
      @update:model-value="$emit('update:modelValue', $event)"
    ></GdprCardText>
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
    modelValue: {
      type: Boolean,
      required: false,
      default: false
    },
    disableActions: {
      type: Boolean,
      required: false,
      default: false
    },
    hideToolbar: {
      type: Boolean,
      default: false
    }
  },
  emits: ["update:modelValue"],
  data: () => ({
    value: false
  }),
  watch: {
    modelValue(val) {
      this.value = val;
    }
  }
};
</script>
