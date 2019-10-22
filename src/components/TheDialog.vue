<template>
  <v-dialog
    v-model="dialog"
    :persistent="persistent"
    :max-width="maxWidth"
    :fullscreen="fullscreen"
    transition="dialog-bottom-transition"
    @click:outside="$emit('click:outside')"
    @keydown.esc="$emit('close')"
  >
    <slot name="content"></slot>
  </v-dialog>
</template>

<script>
export default {
  name: "TheDialog",
  props: {
    maxWidth: {
      type: Number,
      default: 290
    },
    persistent: {
      type: Boolean,
      default: true
    },
    fullscreen: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialog: true
    };
  }
};
</script>
