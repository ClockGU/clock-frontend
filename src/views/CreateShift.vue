<template>
  <v-container>
    <v-layout wrap justify-center>
      <v-flex xs12 md8 lg10>
        <shift-form :uuid="uuid" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import ShiftForm from "@/components/shifts/ShiftForm";

export default {
  name: "CreateShift",
  components: { ShiftForm },
  props: {
    uuid: {
      type: String,
      default: null
    }
  }
};
</script>
