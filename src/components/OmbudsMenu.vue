<template>
  <div :class="bottomPosition ? 'ombuds-menu' : ''">
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
        <slot name="activator" v-bind="props"></slot>
        <v-sheet
          v-if="!disableActivator"
          class="py-2 bg-red darken-5 rounded-t"
          dark
          v-bind="props['props']"
        >
          <v-icon v-if="smAndDown" class="mx-2">
            {{ icons.mdiExclamation }}
          </v-icon>
          <span v-else class="px-4">Ombudsperson</span>
        </v-sheet>
      </template>

      <OmbudsForm @close="menu = false" />
    </v-menu>
  </div>
</template>

<script>
import OmbudsForm from "@/components/OmbudsForm.vue";
import { mdiExclamation } from "@mdi/js";
import { useDisplay } from "vuetify";

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
      const { smAndDown } = useDisplay();
      return smAndDown.value;
    }
  }
};
</script>

<style lang="scss" scoped>
.ombuds-menu {
  position: fixed;
  bottom: 0em;
  left: 9em;
  z-index: 1;
}
</style>
