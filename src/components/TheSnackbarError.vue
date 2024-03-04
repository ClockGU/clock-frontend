<template>
  <v-snackbar
    v-model="show"
    data-cy="snackbar"
    location="top right"
    :color="color"
    :timeout="timeout"
  >
    {{ message }}
    <template #actions="{ attrs }">
      <v-btn variant="text" v-bind="attrs" @click="show = false">
        {{ $t("actions.close") }}
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  name: "TheSnackbarError",
  data() {
    return {
      show: false,
      message: null,
      timeout: null,
      color: null
    };
  },
  watch: {
    show: function (value) {
      if (value) return;

      this.$store.dispatch("errorbar/resetSnack");
    }
  },
  created: function () {
    this.$store.watch(
      (state, getters) => getters["errorbar/snack"],
      () => {
        const { errorbar } = this.$store.state.errorbar;
        if (!errorbar.snack) return;

        this.message = errorbar.snack;
        this.color = errorbar.color;
        this.timeout = errorbar.timeout;
        this.show = true;
      }
    );
  }
};
</script>
