<template>
  <v-dialog
    v-model="dialog"
    :persistent="persistent"
    :fullscreen="fullscreen"
    :max-width="maxWidth"
    transition="slide-y-reverse-transition"
    @click:outside="close"
    @update:model-value="$emit('update:model-value', $event)"
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
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: ["close", 'update:model-value'],
  data() {
    return {
      dialog: false
    };
  },
  watch: {
    modelValue(val) {
      this.dialog = val;
    }
  },
  methods: {
    close() {
      this.dialog = false;
      this.$emit("update:model-value", false);
      this.$emit("close");
    }
  }
};
</script>
