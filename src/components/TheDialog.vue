<template>
  <v-dialog
    v-model="dialog"
    :persistent="persistent"
    :fullscreen="fullscreen"
    :max-width="maxWidth"
    transition="slide-y-reverse-transition"
    @click:outside="$emit('close')"
  >
    <template #activator="props">
      <slot name="activator" v-bind="props"></slot>
    </template>
    <slot name="content" :events="{ close }" @close="close"></slot>
  </v-dialog>
</template>

<script>
export default {
  name: "TheDialog",
  model: {
    prop: "show",
    event: "change"
  },
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
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ["close"],
  data() {
    return {
      dialog: false
    };
  },
  watch: {
    show(val) {
      this.dialog = val;
    }
  },
  methods: {
    close() {
      this.dialog = false;
      this.$emit("close");
    }
  }
};
</script>
