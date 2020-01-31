<template>
  <portal to="fab">
    <v-btn
      fab
      dark
      :top="$vuetify.breakpoint.mdAndUp"
      :left="$vuetify.breakpoint.mdAndUp"
      :absolute="$vuetify.breakpoint.mdAndUp"
      :bottom="$vuetify.breakpoint.smAndDown"
      :right="$vuetify.breakpoint.smAndDown"
      :fixed="$vuetify.breakpoint.smAndDown"
      color="purple lighten-2"
      data-cy="shift-create-button"
      :to="to"
    >
      <v-icon>{{ icons.mdiPlus }}</v-icon>
    </v-btn>
  </portal>
</template>

<script>
import { mdiPlus } from "@mdi/js";

export default {
  name: "TheFAB",
  props: {
    to: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    icons: { mdiPlus }
  })
};
</script>
