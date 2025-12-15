<template>
  <v-dialog
    ref="dialog"
    v-model="dialog"
    width="600"
    aria-labelledby="ombud-title"
    aria-describedby="ombud-description"
  >
    <template #activator="props">
      <slot name="activator" v-bind="props"> </slot>
      <v-btn
        v-if="!disableActivator"
        variant="flat"
        class="ml2py-2 rounded-b-0"
        style="background: rgb(var(--v-theme-error-lighten-1))"
        v-bind="props['props']"
        :size="smAndDown ? 40 : 'default'"
      >
        <v-icon v-if="smAndDown" size="24" color="white">
          {{ icons.mdiExclamation }}
        </v-icon>
        <span v-else class="px-4">Ombudsperson</span>
      </v-btn>
    </template>

    <OmbudsForm @close="dialog = false" />
  </v-dialog>
</template>

<script>
import OmbudsForm from "@/components/OmbudsForm.vue";
import { mdiExclamation } from "@mdi/js";

export default {
  name: "OmbudsMenu",
  components: { OmbudsForm },
  props: {
    disableActivator: {
      type: Boolean,
      default: false
    },
    bottomPosition: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    dialog: false,
    icons: { mdiExclamation }
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
