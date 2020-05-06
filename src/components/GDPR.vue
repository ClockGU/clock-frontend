<template>
  <v-card :elevation="$vuetify.breakpoint.mdAndUp ? 0 : null">
    <v-card-text :class="$vuetify.breakpoint.mdAndUp ? 'py-0' : ''">
      You can request and download all information saved by you. The download is
      provided in JSON.
    </v-card-text>

    <v-card-actions>
      <v-btn
        :loading="loading"
        :outlined="loading"
        text
        color="primary"
        @click="action"
      >
        {{ downloadLabel }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import GDPRService from "@/services/gdpr";

export default {
  name: "GDPR",
  data() {
    return {
      filename: "GDPR.json",
      response: null,
      loading: false
    };
  },
  computed: {
    downloadLabel() {
      return !this.response ? "Request" : "Download";
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
      let link = document.createElement("a");
      link.href = window.URL.createObjectURL(
        new Blob([this.response], { type: "application/pdf" })
      );
      link.download = this.filename;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    async request() {
      this.loading = true;
      const { data } = await GDPRService.get();
      this.response = data;
      this.loading = false;
    }
  }
};
</script>
