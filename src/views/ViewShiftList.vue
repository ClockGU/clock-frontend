<template>
  <ShiftListFrame>
    <FrameHooks
      slot-scope="{
        shifts,
        methods: { fetchList },
        status: { loading, error }
      }"
      @created="fetchList()"
    >
      <span v-if="loading">Loading...</span>
      <span v-else-if="error">Error while fetching data!</span>
      <ul v-else>
        <li v-for="shift in shifts" :key="shift.uuid">
          <v-btn :to="{ name: 'editShift', params: { uuid: shift.uuid } }">
            {{ shift.date.start }}
          </v-btn>
          <!-- <v-btn @click="showSnack()">SNACK</v-btn> -->
        </li>
      </ul>
    </FrameHooks>
  </ShiftListFrame>
</template>

<script>
import ShiftListFrame from "@/components/shifts/ShiftListFrame";
import FrameHooks from "@/components/FrameHooks";

export default {
  name: "ShiftList",
  components: { ShiftListFrame, FrameHooks }
  // methods: {
  // showSnack() {
  // this.$store.dispatch("snackbar/setSnack", {
  // snack: "You dun' goofed!"
  // color: "error",
  // timeout: 0
  //   });
  // }
  // }
};
</script>
