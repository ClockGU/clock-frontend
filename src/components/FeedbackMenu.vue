<template>
  <div class="feedback-menu">
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :nudge-width="400"
      transition="slide-y-transition"
    >
      <template #activator="{ on, attrs }">
        <v-sheet
          class="py-2 bg-orange-darken-2 rounded-t"
          dark
          v-bind="attrs"
          v-on="on"
        >
          <v-icon v-if="smAndDown" class="mx-2">
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
import FeedbackForm from "@/components/FeedbackForm.vue";
import { mdiHelp } from "@mdi/js";
import { useDisplay } from "vuetify";

export default {
  name: "FeedbackMenu",
  components: { FeedbackForm },
  data: () => ({
    menu: false,
    icons: { mdiHelp }
  }),
  computed: {
    smAndDown() {
      const { smAndDown } = useDisplay();
      return smAndDown;
    }
  }
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
