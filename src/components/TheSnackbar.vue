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
    <template v-slot:action="{ attrs }">
      <v-btn text v-bind="attrs" @click.native="show = false">
        {{ $t("actions.close") }}
      </v-btn>
    </template>
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
