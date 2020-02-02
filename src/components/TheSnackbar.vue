<template>
  <v-snackbar
    v-model="show"
    data-cy="snackbar"
    top
    right
    :color="color"
    :timeout="timeout"
  >
    {{ message }}
    <v-btn text @click.native="show = false">
      Close
    </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  name: "TheSnackbar",
  data() {
    return {
      show: false,
      message: null,
      timeout: null,
      color: null
    };
  },
  watch: {
    show: function(value) {
      if (value) return;

      this.$store.dispatch("snackbar/resetSnack");
    }
  },
  created: function() {
    this.$store.watch(
      (state, getters) => getters["snackbar/snack"],
      () => {
        const { snackbar } = this.$store.state.snackbar;
        if (!snackbar.snack) return;

        this.message = snackbar.snack;
        this.color = snackbar.color;
        this.timeout = snackbar.timeout;
        this.show = true;
      }
    );
  }
};
</script>
