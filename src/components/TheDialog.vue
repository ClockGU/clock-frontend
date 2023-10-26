<template>
  <v-dialog
    v-model="dialog"
    :persistent="persistent"
    :fullscreen="fullscreen"
    :max-width="maxWidth"
    transition="slide-y-reverse-transition"
    @click:outside="close"
    @input="$emit('input', $event)"
  >
    <template #activator="{ on }">
      <slot name="activator" :on="on"></slot>
    </template>
    <slot name="content" :events="{ close }" @close="close"></slot>
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
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialog: false
    };
  },
  watch: {
    value(val) {
      this.dialog = val;
    }
  },
  methods: {
    close() {
      console.log("close called");
      this.dialog = false;
      this.$emit("input", false);
      this.$emit("close");
    }
  }
};
</script>
