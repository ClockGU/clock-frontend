<template>
  <v-dialog
    v-model="dialog"
    :persistent="persistent"
    :fullscreen="fullscreen"
    :max-width="maxWidth"
    transition="slide-y-reverse-transition"
    role="dialog"
    aria-modal="true"
    :aria-labelledby="ariaLabelledBy"
    @click:outside="close"
    @update:model-value="$emit('update:modelValue', $event)"
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
    },
    ariaLabelledBy: {
      type: String,
      default: null
    }
  },
  emits: ["close", "update:modelValue"],
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
      this.$emit("update:modelValue", false);
      this.$emit("close");
    }
  }
};
</script>
