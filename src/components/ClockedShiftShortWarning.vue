<template>
  <v-card data-cy="short-warning">
    <v-card-title class="headline word-break">
      This shift looks very short.
    </v-card-title>
    <v-card-text>
      Do you want to save this shift or continue working? We can also forget
      about it completely.
    </v-card-text>
    <v-card-actions>
      <v-row>
        <v-col sm="12">
          <v-btn
            data-cy="short-save"
            color="primary"
            text
            @click="toggleShortShift(callbacks.stop)"
          >
            Finish and save shift
          </v-btn>
        </v-col>
        <v-col sm="12">
          <v-btn
            data-cy="short-continue"
            text
            @click="toggleShortShift(callbacks.unpause)"
          >
            Continue working
          </v-btn>
        </v-col>
        <v-col sm="12">
          <v-btn
            data-cy="short-discard"
            color="error"
            text
            @click="toggleShortShift(callbacks.reset)"
          >
            Discard shift
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "ClockedShiftShortWarning",
  props: {
    callbacks: {
      type: Object,
      required: true
    }
  },
  methods: {
    toggleShortShift(callback) {
      callback();

      this.$emit("close");
    }
  }
};
</script>
