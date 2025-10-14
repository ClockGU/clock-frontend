<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <Calendar
          :disabled="disabled"
          :initial-focus="focus"
          initial-type="month"
        >
        </Calendar>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Calendar from "@/components/calendar/Calendar.vue";
import { mapGetters } from "vuex";

export default {
  name: "ViewCalendar",
  metaInfo() {
    return {
      title: this.$t("app.calendar")
    };
  },
  components: {
    Calendar
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      selectedContract: "selectedContract/selectedContract"
    }),
    disabled() {
      return this.selectedContract === undefined;
    },
    focus() {
      return new Date();
    }
  }
};
</script>
