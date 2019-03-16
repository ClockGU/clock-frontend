<template>
  <v-container>
    <v-layout row wrap>
      <shift-form />
    </v-layout>
  </v-container>
</template>

<script>
import ShiftForm from "@/components/shifts/ShiftForm";

export default {
  name: "CreateShift",
  components: { ShiftForm }
};
</script>
