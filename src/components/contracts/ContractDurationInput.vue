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
      <v-col v-if="mdAndUp" cols="2" class="text-center">
        {{ $t("contracts.to") }}
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
import ContractFormDateInput from "@/components/contracts/ContractFormDateInput.vue";
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
  emits: ["update:start-date", "update:end-date"],
  data() {
    return {
      start: this.startDate,
      end: this.endDate
    };
  },
  computed: {
    mdAndUp() {
      return this.$vuetify.display.mdAndUp;
    },
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
      this.$emit("update:start-date", this.start);
    },
    end() {
      this.$emit("update:end-date", this.end);
    }
  }
};
</script>

<style scoped></style>
