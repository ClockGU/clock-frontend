<template>
  <div>
    <v-card-text class="pb-0">
      <i18n-t keypath="privacyagreement.text" tag="p" scope="global">
        <template #privacyAgreement>
          <GdprTextDialog></GdprTextDialog>
        </template>
      </i18n-t>

      <v-checkbox
        v-model="value"
        :label="$t('privacyagreement.checkbox')"
        @update:model-value="$emit('update:modelValue', $event)"
      >
      </v-checkbox>
    </v-card-text>
    <v-card-text> {{ $t("privacyagreement.revokeInfo") }} </v-card-text>
  </div>
</template>

<script>
import GdprTextDialog from "@/components/gdpr/text-components/GdprTextDialog.vue";
export default {
  name: "GdprCardText",
  components: { GdprTextDialog },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: ["update:modelValue"],
  data() {
    return {
      value: false
    };
  },
  watch: {
    modelValue(val) {
      this.value = val;
    }
  }
};
</script>

<style scoped></style>
