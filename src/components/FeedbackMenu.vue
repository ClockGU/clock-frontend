<template>
  <div class="feedback-menu">
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :nudge-width="400"
      transition="slide-y-transition"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-sheet class="py-2 red darken-2" dark v-bind="attrs" v-on="on">
          <v-icon v-if="$vuetify.breakpoint.smAndDown" class="mx-2">
            {{ icons.mdiHelp }}
          </v-icon>
          <span v-else class="px-4">Feedback</span>
        </v-sheet>
      </template>

      <FeedbackForm @close="menu = false" />
    </v-menu>
  </div>
</template>

<script>
import FeedbackForm from "@/components/FeedbackForm";
import { mdiHelp } from "@mdi/js";

export default {
  name: "FeedbackMenu",
  components: { FeedbackForm },
  data: () => ({
    menu: false,
    icons: { mdiHelp }
  })
};
</script>

<style lang="scss" scoped>
.feedback-menu {
  position: fixed;
  bottom: 0em;
  left: 1em;
  z-index: 1;
}
</style>
