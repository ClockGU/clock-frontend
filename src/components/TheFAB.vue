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
      :to="{ name: 'createShift' }"
    >
      <v-icon>{{ icons.mdiPlus }}</v-icon>
    </v-btn>
  </portal>
</template>

<script>
import { mdiPlus } from "@mdi/js";

export default {
  name: "TheFAB",
  data: () => ({
    icons: { mdiPlus }
  })
};
</script>
