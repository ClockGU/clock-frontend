<template>
  <div>
    <v-card-text class="pb-0">
      <i18n path="privacyagreement.text" tag="p">
        <template #privacyAgreement>
          <GdprTextDialog></GdprTextDialog>
        </template>
      </i18n>

      <v-checkbox
        v-model="value"
        :label="$t('privacyagreement.checkbox')"
        @click="updateValue"
      >
      </v-checkbox>
    </v-card-text>
    <v-card-text> {{ $t("privacyagreement.revokeInfo") }} </v-card-text>
  </div>
</template>

<script>
import GdprTextDialog from "@/components/gdpr/text-components/GdprTextDialog";
export default {
  name: "GdprCardText",
  components: { GdprTextDialog },
  data() {
    return {
      value: false
    };
  },
  methods: {
    updateValue() {
      this.$emit("checkbox-updated", this.value);
    }
  }
};
</script>

<style scoped></style>
