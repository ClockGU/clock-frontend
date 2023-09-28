<template>
  <v-card variant="outlined">
    <v-card-text class="text-body-1"
      ><i18n-t keypath="dashboard.welcome.text" scope="global">
        <template #link>
          <base-link
            class="text-no-wrap"
            :href="$t('dashboard.welcome.url')"
            target="_blank"
          >
            <template #default>{{ $t("dashboard.welcome.linktext") }}</template>
          </base-link>
        </template>
      </i18n-t>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "DashboardWelcome"
};
</script>
