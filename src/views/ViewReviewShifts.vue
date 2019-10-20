<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>
          Review shift
        </h1>
      </v-col>
    </v-row>

    <ClockedShiftSplitWarning
      :shift="shift"
      :callbacks="callbacks"
      :pseudo-shifts="pseudoShifts"
      @pseudoShifts="setPseudoShifts"
    />
  </v-container>
</template>

<script>
import ClockedShiftSplitWarning from "@/components/ClockedShiftSplitWarning";
import { Shift } from "@/models/ShiftModel";
import { mapGetters } from "vuex";

export default {
  name: "ViewReviewShift",
  components: { ClockedShiftSplitWarning },
  data() {
    return {
      callbacks: {}
    };
  },
  computed: {
    ...mapGetters({
      stagedShift: "shift/stagedShift",
      pseudoShifts: "shift/pseudoShifts"
    }),
    shift() {
      return new Shift(this.stagedShift);
    }
  },
  methods: {
    setPseudoShifts(shifts) {
      this.$store.dispatch("shift/setPseudoShifts", shifts);
    }
  }
};
</script>
