<template>
  <v-card :elevation="0">
    <v-alert type="success" variant="outlined" class="ma-4">{{
      $t("gdpr.accepted")
    }}</v-alert>

    <v-card-text>{{ $t("gdpr.revokeInfo") }}</v-card-text>

    <v-card-text :class="mdAndUp ? 'py-0' : ''">
      {{ $t("gdpr.download") }}
    </v-card-text>

    <v-card-actions>
      <v-btn
        :loading="loading"
        :variant="loading ? 'outlined' : 'text'"
        color="primary"
        @click="action"
      >
        {{ downloadLabel }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { log } from "@/utils/log";
import { localizedFormat } from "@/utils/date";
import { mapGetters } from "vuex";
import GDPRService from "@/services/gdpr";
import { useDisplay } from "vuetify";

export default {
  name: "GdprSettingsCard",
  data() {
    return {
      response: null,
      loading: false
    };
  },
  computed: {
    ...mapGetters({
      user: "user"
    }),
    mdAndUp() {
      const { mdAndUp } = useDisplay();
      return mdAndUp;
    },
    downloadLabel() {
      return this.response === null
        ? this.$t("actions.request")
        : this.$t("actions.download");
    },
    filename() {
      const date = localizedFormat(new Date(), "yyyyMMdd");
      return `${date}_${this.user.first_name}_${
        this.user.last_name
      }_${this.$i18n.t("gdpr.suffix")}.json`;
    }
  },
  methods: {
    action() {
      if (this.response !== null) {
        this.download();
        return;
      }

      this.request();
    },
    download() {
      const link = document.createElement("a");
      const encoded = encodeURIComponent(
        JSON.stringify(this.response.data, null, 2)
      );
      link.setAttribute("href", `data:text/json;charset=utf-8,${encoded}`);
      link.setAttribute("download", this.filename);
      link.click();
    },
    async request() {
      this.loading = true;
      try {
        this.response = await GDPRService.get();
      } catch (error) {
        // TODO: set error state in component
        log(error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
