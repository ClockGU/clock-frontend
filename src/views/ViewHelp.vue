<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card :elevation="$vuetify.breakpoint.smAndDown ? 0 : null">
          <portal-target name="card-toolbar"></portal-target>

          <portal
            :to="$vuetify.breakpoint.smAndDown ? 'app-bar' : 'card-toolbar'"
          >
            <v-toolbar slot-scope="{ action }" :elevation="0">
              <v-app-bar-nav-icon
                v-if="$vuetify.breakpoint.smAndDown"
                icon
                @click="action"
              ></v-app-bar-nav-icon>

              <v-toolbar-title>{{ $t("help.title") }}</v-toolbar-title>
            </v-toolbar>
          </portal>

          <v-card-text>
            <span>
              {{ $t("help.blurb1") }}
            </span>
            <p>
              <strong>
                {{ $t("help.blurb2") }}
              </strong>
            </p>
          </v-card-text>

          <v-card-actions>
            <v-btn color="error" text @click="reset">{{
              $t("actions.reset")
            }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
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
