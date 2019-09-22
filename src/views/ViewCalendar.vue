<template>
  <div>
    <Calendar :start="start" :type="type">
      <v-fade-transition v-if="loading">
        <v-overlay absolute color="#036358">
          <v-progress-circular indeterminate size="32"></v-progress-circular>
        </v-overlay>
      </v-fade-transition>
    </Calendar>

    <portal to="fab">
      <v-btn
        absolute
        dark
        fab
        top
        right
        color="pink"
        :to="{ name: 'createShift' }"
      >
        <v-icon>{{ icons.mdiPlus }}</v-icon>
      </v-btn>
    </portal>
  </div>
</template>

<script>
import Calendar from "@/components/calendar/Calendar";
import { createHelpers } from "vuex-map-fields";

import { mdiPlus } from "@mdi/js";

const { mapFields: mapContractFields } = createHelpers({
  getterType: "contract/getField",
  mutationType: "contract/updateField"
});

const { mapFields: mapShiftFields } = createHelpers({
  getterType: "shift/getField",
  mutationType: "shift/updateField"
});

export default {
  name: "ViewCalendar",
  components: {
    Calendar
  },
  props: {
    type: {
      type: String,
      default: "month"
    },
    year: {
      type: String,
      default: String(new Date().getUTCFullYear())
    },
    month: {
      type: String,
      default: String(new Date().getUTCMonth() + 1)
    },
    day: {
      type: String,
      default: String(new Date().getUTCDate())
    }
  },
  data() {
    return {
      icons: { mdiPlus: mdiPlus }
    };
  },
  computed: {
    ...mapContractFields(["contracts"]),
    ...mapShiftFields(["shifts"]),
    date() {
      return new Date(Date.UTC(this.year, this.month - 1, this.day));
    },
    start() {
      return this.date.toISOString().slice(0, 10);
    },
    loading() {
      return this.$store.state.loadingData;
    }
  }
};
</script>
