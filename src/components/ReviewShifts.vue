<template>
  <v-container>
    <TheDialog
      v-if="dialog"
      hide-overlay
      transition="dialog-bottom-transition"
      :fullscreen="problem === 'overflow'"
    >
      <template v-slot:content>
        <v-card data-cy="review-shift">
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
            @close="close"
            @editShift="editShift"
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

    <v-dialog v-if="entity" v-model="formDialog">
      <v-card>
        <v-container data-cy="review-edit-shift">
          <ReviewShiftForm
            :query="query"
            :uuid="entity.uuid"
            :entity="entity"
          />
        </v-container>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import ReviewShiftForm from "@/components/shifts/ReviewShiftForm";
import TheDialog from "@/components/TheDialog";
import ClockedShiftSplitWarning from "@/components/ClockedShiftSplitWarning";
import ClockedShiftShortWarning from "@/components/ClockedShiftShortWarning";
import { Shift } from "@/models/ShiftModel";
import { mapGetters } from "vuex";

import { eachDayOfInterval } from "date-fns";

import { mdiClose } from "@mdi/js";

export default {
  name: "ReviewShift",
  components: {
    ClockedShiftSplitWarning,
    ClockedShiftShortWarning,
    ReviewShiftForm,
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
    }
  },
  created() {
    if (this.separateDays.length > 1) {
      this.problem = "overflow";
      this.query = this.updatePseudoShift;
    } else {
      this.problem = "short";
    }
  },
  methods: {
    editShift(shift) {
      this.entity = shift;
      this.formDialog = true;
    },
    updatePseudoShift(shift) {
      this.$store.dispatch("shift/updatePseudoShift", shift);

      this.formDialog = false;
      this.entity = null;
    },
    setPseudoShifts(shifts) {
      this.$store.dispatch("shift/setPseudoShifts", shifts);
    },
    close() {
      this.$emit("close");
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
