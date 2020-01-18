<template>
  <v-container>
    <ShiftForm
      v-if="entity"
      :now="now"
      :query="endpoint"
      :uuid="uuid"
      :entity="entity"
      @submit="redirect"
    />
  </v-container>
</template>

<script>
import ShiftForm from "@/components/shifts/ShiftForm";
import { Shift } from "@/models/ShiftModel";
import ShiftService from "@/services/shift";
import { handleApiError } from "../utils/interceptors";

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
    const shifts = this.$store.state.shift.shifts;

    const entity = shifts.find(shift => shift.uuid === this.uuid);
    this.endpoint = data =>
      this.uuid === null
        ? ShiftService.create(data.toPayload())
        : ShiftService.update(data.toPayload(), this.uuid);

    if (entity !== undefined) {
      this.entity = new Shift(entity);
    } else if (this.uuid != null) {
      const response = await ShiftService.get(this.uuid).catch(handleApiError);
      this.entity = new Shift(response.data);
    } else {
      this.entity = new Shift({ date: { start: this.now } });
    }
  },
  methods: {
    redirect() {
      this.$router.push(this.redirectTo);
    }
  }
};
</script>
