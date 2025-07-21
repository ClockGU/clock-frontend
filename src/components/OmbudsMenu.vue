<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    :min-width="400"
    :max-width="600"
    :offset-y="offsetY"
    :bottom="bottom"
    transition="slide-y-transition"
  >
    <template #activator="props">
      <slot name="activator" v-bind="props"> </slot>
      <v-btn
        v-if="!disableActivator"
        variant="flat"
        :class="[bottomPosition ? 'ombuds-menu' : '', 'py-2', 'rounded-b-0']"
        style="background: rgb(var(--v-theme-error-lighten-1))"
        v-bind="props['props']"
        size="40"
      >
        <v-icon v-if="smAndDown" size="24" color="white">
          {{ icons.mdiExclamation }}
        </v-icon>
        <span v-else class="px-4">Ombudsperson</span>
      </v-btn>
    </template>

    <OmbudsForm @close="menu = false" />
  </v-menu>
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
    },
    offsetY: {
      type: Boolean,
      default: false
    },
    bottom: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    menu: false,
    icons: { mdiExclamation }
  }),
  computed: {
    smAndDown() {
      return this.$vuetify.display.smAndDown;
    }
  }
};
</script>

<style lang="scss" scoped>
.ombuds-menu {
  position: fixed;
  bottom: 0em;
  left: 6em;
  z-index: 1;
}
</style>
