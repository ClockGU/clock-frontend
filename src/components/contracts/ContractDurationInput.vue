<template>
  <v-container>
    <v-row>
      <v-col cols="5" md="5">
        <ContractFormDateInput
          v-model="start"
          type="start"
          :disabled="disabled || disableStart"
        />
      </v-col>

      <v-col v-if="$vuetify.breakpoint.mdAndUp" class="text-center" cols="2">
        <div class="mt-4 flex">
          {{ $t("contracts.to") }}
        </div>
      </v-col>

      <v-col class="text-center" cols="5" md="5">
        <ContractFormDateInput
          v-model="end"
          :min="minEndDate"
          type="end"
          :disabled="disabled"
        />
      </v-col>
    </v-row>
  </v-container>
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
    },
    disableStart: {
      type: Boolean,
      required: false,
      default: false
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
