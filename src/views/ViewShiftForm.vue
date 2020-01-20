<template>
  <v-container>
    <ShiftForm
      v-if="entity"
      :now="now"
      :query="endpoint"
      :uuid="uuid"
      :entity="entity"
      @submit="redirect"
      @cancel="redirect"
      @redirect="redirect"
    />
  </v-container>
</template>

<script>
import ShiftForm from "@/components/shifts/ShiftForm";
import { Shift } from "@/models/ShiftModel";
import ShiftService from "@/services/shift";

export default {
  name: "ViewShiftForm",
  components: { ShiftForm },
  props: {
    now: {
      type: Date,
      default: () => new Date()
    },
    uuid: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      entity: null,
      endpoint: null,
      prevRoute: null
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.prevRoute = from;
    });
  },
  computed: {
    redirectTo() {
      const params = this.prevRoute === null ? null : this.prevRoute.params;
      const REDIRECT_TO = {
        genericCalendar: { name: "c" },
        specificCalendar: { name: "calendar", params: params },
        shiftList: { name: "shiftList" }
      };

      return REDIRECT_TO[this.visitType];
    },
    visitType() {
      const isVisitingDirectly =
        this.prevRoute === null ||
        (this.prevRoute.fullPath === "/" &&
          this.prevRoute.name === null &&
          this.prevRoute.path === "/");
      const isVisitingFromCalendar = this.prevRoute.name === "calendar";
      const isVisitingFromShiftList = this.prevRoute.name === "shiftList";

      if (isVisitingDirectly) {
        // Coming from nothing, redirect to calendar.
        return "genericCalendar";
      } else if (isVisitingFromCalendar) {
        // Coming from the calendar, redirect to the specific parameters.
        return "specificCalendar";
      } else if (isVisitingFromShiftList) {
        // Coming from the shift list
        return "shiftList";
      } else {
        // Fallback -- just in case.
        return "genericCalendar";
      }
    }
  },
  async created() {
    this.endpoint = data =>
      this.uuid === null
        ? ShiftService.create(data.toPayload())
        : ShiftService.update(data.toPayload(), this.uuid);

    Promise.all([
      this.$store.dispatch("shift/queryShifts"),
      this.$store.dispatch("contract/queryContracts")
    ]).then(values => {
      const entity = values[0].find(shift => shift.uuid === this.uuid);
      if (entity !== undefined) {
        this.entity = new Shift(entity);
      } else {
        this.entity = new Shift();
      }
    });
  },
  methods: {
    redirect() {
      this.$router.push(this.redirectTo);
    }
  }
};
</script>
