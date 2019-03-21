<template>
  <ul>
    <li v-for="shift in shifts" :key="shift.uuid">
      <v-btn :to="{ name: 'editShift', params: { uuid: shift.uuid } }">
        {{ shift.uuid }}
      </v-btn>
    </li>
  </ul>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "ShiftList",
  computed: {
    ...mapState({
      shifts: state => state.shift.shifts
    })
  }
};
</script>
