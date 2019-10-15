<template>
  <!-- <portal to="dialog"> -->
  <TheDialog :max-width="400">
    <template v-slot:content>
      <v-card>
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
                color="primary"
                text
                @click="toggleShortShift(callbacks.stop)"
              >
                Finish and save shift
              </v-btn>
            </v-col>
            <v-col sm="12">
              <v-btn text @click="toggleShortShift(callbacks.unpause)">
                Continue working
              </v-btn>
            </v-col>
            <v-col sm="12">
              <v-btn
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
  </TheDialog>
  <!-- </portal> -->
</template>

<script>
import TheDialog from "@/components/TheDialog";

export default {
  name: "ClockedShiftShortWarning",
  components: {
    TheDialog
  },
  props: {
    callbacks: {
      type: Object,
      required: true
    }
  },
  methods: {
    toggleShortShift(callback) {
      callback();
      this.dialog = false;
    }
  }
};
</script>
