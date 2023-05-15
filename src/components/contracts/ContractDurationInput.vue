<template>
  <v-row align="center" justify="start">
    <v-col cols="12" md="5">
      <ContractFormDateInput
        v-model="start"
        type="start"
        :disabled="disabled"
      />
    </v-col>

    <v-col v-if="$vuetify.breakpoint.mdAndUp" cols="2" class="text-center">
      {{ $t("contracts.to") }}
    </v-col>

    <v-col cols="12" md="5">
      <ContractFormDateInput
        v-model="end"
        :min="minEndDate"
        type="end"
        :disabled="disabled"
      />
    </v-col>
  </v-row>
</template>

<script>
import ContractFormDateInput from "@/components/contracts/ContractFormDateInput";
import { format } from "date-fns";
import { lastOfCurrentMonth } from "@/utils/date";

export default {
  name: "ContractDurationInput",
  components: { ContractFormDateInput },
  props: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    }
  },
  data() {
    return {
      start: this.startDate,
      end: this.endDate
    };
  },
  computed: {
    disabled() {
      return false;
    },
    minEndDate() {
      return format(lastOfCurrentMonth, "yyyy-MM-dd");
    }
  },
  watch: {
    startDate(val) {
      this.start = val;
    },
    endDate(val) {
      this.end = val;
    },
    start() {
      this.input();
    },
    end() {
      this.input();
    }
  },
  methods: {
    input() {
      this.$emit("input", { startDate: this.start, endDate: this.end });
    }
  }
};
</script>

<style scoped></style>
