<template>
  <ul>
    <li v-for="shift in shifts" :key="shift.id">{{ shift.uuid }}</li>
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
