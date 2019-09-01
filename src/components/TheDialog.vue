<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" :persistent="persistent" :max-width="maxWidth">
      <slot name="content"></slot>
    </v-dialog>
  </v-row>
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
    }
  },
  data() {
    return {
      dialog: true
    }
  }
};
</script>
