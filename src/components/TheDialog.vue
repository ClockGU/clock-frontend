<template>
  <v-row justify="center">
    <v-dialog v-model="show" persistent max-width="290">
      <slot name="content"></slot>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  name: "TheDialog",
  computed: {
    show() {
      return !!this.$slots.content;
    }
  }
};
</script>
