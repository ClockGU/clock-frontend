<template>
  <v-card outlined>
    <v-card-text class="body-1"
      ><i18n path="dashboard.welcome.text">
        <template #link>
          <base-link
            class="text-no-wrap"
            :href="$t('dashboard.welcome.url')"
            target="_blank"
          >
            <template #default>{{ $t("dashboard.welcome.manual") }}</template>
          </base-link>
        </template>
      </i18n>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "DashboardWelcome"
};
</script>
