<template>
  <div>
    <v-snackbar
      v-for="(snack, i) in snacks"
      :key="snack.uuid"
      v-model="snack.show"
      data-cy="snackbar"
      location="top right"
      multi-line
      :color="snack.color"
      :timeout="snack.timeout"
      :style="{ 'margin-top': i * 70 + 'px' }"
    >
      {{ snack.message }}
      <template #actions>
        <component
          :is="snack.component"
          v-bind="snack.componentProps"
        ></component>
        <v-btn variant="text" @click="snack.show = false">
          {{ $t("actions.close") }}
        </v-btn>
      </template>
      <v-progress-linear
        reverse
        color="white"
        :model-value="(timePassed[snack.uuid] / snack.timeout) * 100"
      ></v-progress-linear>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: "TheSnackbar",
  data() {
    return {
      timePassed: {},
      intervals: {},
      snacks: []
    };
  },
  watch: {
    show: function (value) {
      if (value) return;

      this.$store.dispatch("snackbar/resetSnack");
    }
  },

  created() {
    this.$store.watch(
      (state, getters) => getters["snackbar/snacks"],
      () => {
        this.snacks = this.$store.getters["snackbar/snacks"];
        this.snacks.forEach((snack) => {
          if (this.intervals[snack.uuid] === undefined) {
            this.setupInterval(snack);
            this.setupTimeout(snack);
          }
        });
      },
      {
        deep: true
      }
    );
  },
  methods: {
    async setupInterval(snack) {
      this.intervals[snack.uuid] = setInterval(() => {
        this.timePassed[snack.uuid] =
          (this.timePassed[snack.uuid] !== undefined
            ? this.timePassed[snack.uuid]
            : 0) + 500;
      }, 500);
    },
    async setupTimeout(snack) {
      setTimeout(() => {
        this.removeSnack(snack.uuid);
      }, snack.timeout);
    },
    removeSnack(uuid) {
      delete this.timePassed[uuid];
      clearInterval(this.intervals[uuid]);
      delete this.intervals[uuid];
      this.$store.dispatch("snackbar/removeSnack", uuid);
    }
  }
};
</script>
