<template>
  <ShiftModelList endpoint="api/shifts">
    <template v-slot:default="{ data: shifts, error, loading }">
      <span v-if="loading">Loading...</span>
      <span v-else-if="error">Error while fetching data!</span>
      <ul v-else>
        <li v-for="shift in shifts" :key="shift.uuid">
          <v-btn :to="{ name: 'editShift', params: { uuid: shift.uuid } }">
            {{ shift.date.start }}
          </v-btn>
        </li>
      </ul>
    </template>
  </ShiftModelList>
</template>

<script>
import { mapState } from "vuex";

import ShiftModelList from "@/components/ShiftModelList";

export default {
  name: "ShiftList",
  components: { ShiftModelList },
  computed: {
    ...mapState({
      shifts: state => state.shift.shifts
    })
  }
};
</script>
