<template>
  <v-dialog
    ref="dialog"
    v-model="dialog"
    width="600"
    aria-labelledby="feedback-title"
    aria-describedby="feedback-description"
  >
    <template #activator="{ props }">
      <v-btn
        variant="flat"
        class="mr-2 py-2 rounded-b-0"
        style="background: rgb(var(--v-theme-warning-lighten-1))"
        v-bind="props"
        :aria-label="$t('label.feedback')"
        :size="smAndDown ? 40 : 'default'"
      >
        <v-icon v-if="smAndDown" size="24" color="white">
          {{ icons.mdiHelp }}
        </v-icon>
        <span v-else class="px-4">Feedback</span>
      </v-btn>
    </template>
    <FeedbackForm @close="dialog = false" />
  </v-dialog>
</template>

<script>
import FeedbackForm from "@/components/FeedbackForm.vue";
import { mdiHelp } from "@mdi/js";

export default {
  name: "FeedbackMenu",
  components: { FeedbackForm },
  data: () => ({
    dialog: false,
    icons: { mdiHelp }
  }),
  computed: {
    smAndDown() {
      return this.$vuetify.display.smAndDown;
    }
  },
  watch: {
    show: {
      immediate: true,
      handler: function (newValue) {
        if (newValue) {
          this.$nextTick(() => {
            const dialog = this.$refs?.dialog;
            const content = dialog?.$refs?.content;
            if (content) {
              // Copy aria-labelledby from v-dialog to new rendered element.
              content.setAttribute(
                "aria-labelledby",
                dialog.$attrs["aria-labelledby"]
              );
            }
          });
        }
      }
    }
  }
};
</script>
