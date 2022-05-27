<template>
  <div>
    <v-card-text class="pb-0">
      <i18n path="privacyagreement.text" tag="p">
        <template #privacyAgreement>
          <router-link :to="{ name: 'privacy' }">{{
            $t("app.privacyagreement")
          }}</router-link>
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
export default {
  name: "GdprCardText",
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
