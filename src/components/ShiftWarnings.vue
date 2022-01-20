<template>
  <v-dialog v-model="dialog" :max-width="500" @click:outside="closeDialog">
    <v-card>
      <v-card-title>
        {{ $t("dashboard.progress.warnings.title") }}
      </v-card-title>
      <v-card-text v-for="warning in warnings" :key="warning.index">
        {{ warning.warning }}
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn text color="primary" @click="closeDialog"> OK </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "ShiftWarnings",
  props: {
    warnings: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    dialog: true
  }),
  methods: {
    closeDialog() {
      this.$emit("close");
    }
  }
};
</script>
