<template>
  <v-container>
    <v-layout wrap justify-center>
      <v-flex xs12 md8 lg10>
        <ShiftForm v-if="entity" :uuid="uuid" :entity="entity" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import ShiftForm from "@/components/shifts/ShiftForm";
import { Shift } from "@/models/ShiftModel";
import ContractService from "@/services/contract.service";
import ShiftService from "@/services/shift.service";

export default {
  name: "ViewCreateShift",
  components: { ShiftForm },
  props: {
    uuid: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      entity: null
    };
  },
  async created() {
    const shifts = this.$store.state.shift.shifts;
    const entity = shifts.find(shift => shift.uuid === this.uuid);

    const response = await ContractService.list(this.uuid);

    this.$store.dispatch("contract/setContracts", response.data);

    if (entity !== undefined) {
      this.entity = new Shift(entity);
    } else if (this.uuid != null) {
      const response = await ShiftService.get(this.uuid);
      this.entity = new Shift(response.data);
    } else {
      this.entity = new Shift();
    }
  }
};
</script>
