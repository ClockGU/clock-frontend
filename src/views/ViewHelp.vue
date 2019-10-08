<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>Help</h1>
      </v-col>
    </v-row>

    <v-card>
      <v-card-title>
        Reset app to factory settings
      </v-card-title>

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
  </v-container>
</template>

<script>
export default {
  name: "ViewHelp",
  methods: {
    clearAllIntervals() {
      for (let i = 1; i < 10000; i++) {
        window.clearInterval(i);
      }
    },
    clearVuex() {
      localStorage.removeItem("vuex");
    },
    logout() {
      this.$store.dispatch("auth/logout");
    },
    reset() {
      console.log("Reset.");
      this.clearAllIntervals();
      this.logout();
      this.clearVuex();
    }
  }
};
</script>
