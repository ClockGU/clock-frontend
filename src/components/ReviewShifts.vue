<template>
  <v-container>
    <TheDialog
      v-if="dialog"
      hide-overlay
      transition="dialog-bottom-transition"
      :fullscreen="problem === 'overflow'"
    >
      <template v-slot:content>
        <v-card>
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="close">
              <v-icon>{{ icons.mdiClose }}</v-icon>
            </v-btn>
            <v-toolbar-title>Review shift</v-toolbar-title>
            <!-- <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark text @click="dialog = false">Save</v-btn>
            </v-toolbar-items> -->
          </v-toolbar>

          <ClockedShiftSplitWarning
            v-if="problem === 'overflow'"
            :shift="shiftToBeReviewed"
            :callbacks="callbacks"
            :pseudo-shifts="pseudoShifts"
            @pseudoShifts="setPseudoShifts"
          />

          <ClockedShiftShortWarning
            v-if="problem === 'short'"
            :callbacks="callbacks"
            @close="close"
          />
        </v-card>
      </template>
    </TheDialog>

    <v-dialog v-if="formDialog">
      <ShiftForm :query="query" :uuid="uuid" :entity="entity" />
    </v-dialog>
  </v-container>
</template>

<script>
import ShiftForm from "@/components/shifts/ShiftForm";
import TheDialog from "@/components/TheDialog";
import ClockedShiftSplitWarning from "@/components/ClockedShiftSplitWarning";
import ClockedShiftShortWarning from "@/components/ClockedShiftShortWarning";
import { Shift } from "@/models/ShiftModel";
import { mapGetters } from "vuex";

import { eachDayOfInterval } from "date-fns";

import { mdiClose } from "@mdi/js";

// import uuid from "uuid/v4";

export default {
  name: "ReviewShift",
  components: {
    ClockedShiftSplitWarning,
    ClockedShiftShortWarning,
    ShiftForm,
    TheDialog
  },
  props: {
    callbacks: {
      type: Object,
      required: true
    },
    shift: {
      type: Object,
      required: true
    },
    uuid: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      icons: { mdiClose },
      dialog: true,
      problem: null,
      entity: null,
      formDialog: false,
      query: null
    };
  },
  computed: {
    ...mapGetters({
      stagedShift: "shift/stagedShift",
      pseudoShifts: "shift/pseudoShifts"
    }),
    shiftToBeReviewed() {
      return new Shift({
        contract: this.shift.contract,
        date: { start: this.shift.start, end: new Date() },
        type: { value: "st", text: "Shift" }
      });
    },
    separateDays() {
      const days = eachDayOfInterval({
        start: this.shift.start,
        end: new Date()
      });

      return days;
      // if (days.length > 1) {
      //   this.$emit("handleShift", {
      //     type: "overflow",
      //     actions: { stop, pause, reset, data }
      //   });

      //   stop({ submit: false });
      //   return;
      // }
    }
  },
  created() {
    if (this.separateDays > 1) {
      this.problem = "overflow";

      const entity = this.$store.state.shift.pseudoShifts.find(
        shift => shift.uuid === this.uuid
      );
      this.query = this.updatePseudoShift;

      if (entity !== undefined) {
        this.entity = new Shift(entity);
      }
    } else {
      this.problem = "short";
    }
  },
  methods: {
    updatePseudoShift(shift) {
      this.$store.dispatch("shift/updatePseudoShift", shift);
      this.$router.go(-1);
    },
    close() {
      this.$emit("close", { actions: { test: "asd" } });
    },
    setPseudoShifts(shifts) {
      this.$store.dispatch("shift/setPseudoShifts", shifts);
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (vm.stagedShift === null) {
        vm.$router.push({ name: "c" });
      }
    });
  }
};
</script>
