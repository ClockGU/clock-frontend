<template>
  <v-card :elevation="$vuetify.breakpoint.smAndDown ? 0 : null">
    <portal-target name="card-toolbar"></portal-target>

    <portal :to="$vuetify.breakpoint.smAndDown ? 'app-bar' : 'card-toolbar'">
      <v-toolbar slot-scope="{ action }" :elevation="0">
        <v-app-bar-nav-icon
          v-if="$vuetify.breakpoint.smAndDown"
          icon
          @click="action"
        ></v-app-bar-nav-icon>

        <v-toolbar-title> Help </v-toolbar-title>
      </v-toolbar>
    </portal>

    <v-card-text>
      <span>
        If you are experiencing problems, you can reset the app to its factory
        settings. You will be logged out
      </span>

      <p>
        <strong>
          This will NOT delete any of your data. All your shifts and contracts
          will remain untouched.
        </strong>
      </p>
    </v-card-text>

    <v-card-actions>
      <v-btn color="error" text @click="reset">Reset</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "ViewHelp",
  metaInfo() {
    return {
      title: this.$t("app.help")
    };
  },
  methods: {
    clearAllIntervals() {
      for (let i = 1; i < 10000; i++) {
        window.clearInterval(i);
      }
    },
    clearVuex() {
      this.$store.dispatch("unsetContract");
      localStorage.removeItem("vuex");
    },
    logout() {
      this.$store.dispatch("auth/LOGOUT");
    },
    reset() {
      this.clearAllIntervals();
      this.logout();
      this.clearVuex();
    }
  }
};
</script>
