<template>
  <div class="feedback-menu">
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :nudge-width="400"
      transition="slide-y-transition"
    >
      <template #activator="{ props }">
        <v-btn
          v-if="!disableActivator"
          variant="flat"
          :class="[bottomPosition ? 'ombuds-menu' : '', 'py-2', 'rounded-b-0']"
          style="background: rgb(var(--v-theme-warning-lighten-1))"
          v-bind="props['props']"
          size="40"
        >
          <v-icon v-if="smAndDown" size="24" color="white">
            {{ icons.mdiHelp }}
          </v-icon>
          <span v-else class="px-4">Feedback</span>
        </v-btn>
      </template>

      <FeedbackForm @close="menu = false" />
    </v-menu>
  </div>
</template>

<script>
import FeedbackForm from "@/components/FeedbackForm.vue";
import { mdiHelp } from "@mdi/js";

export default {
  name: "FeedbackMenu",
  components: { FeedbackForm },
  data: () => ({
    menu: false,
    icons: { mdiHelp }
  }),
  computed: {
    smAndDown() {
      return this.$vuetify.display.smAndDown;
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
