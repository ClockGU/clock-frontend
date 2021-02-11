<template>
  <v-dialog
    v-model="dialog"
    :persistent="persistent"
    :max-width="maxWidth"
    :fullscreen="fullscreen"
    transition="dialog-bottom-transition"
    @click:outside="handleClickOutside"
    @keydown.esc="$emit('close')"
    @input="$emit('input', false)"
  >
    <template #activator="{ on }">
      <slot name="activator" :on="on"></slot>
    </template>

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
    dialog: function (value) {
      if (!value) return;

      this.$emit("input", value);
    },
    value: function (value) {
      if (value) return;

      this.dialog = false;
    }
  },
  created() {
    const close = (e) => {
      const ESC = 27;
      if (e.keyCode !== ESC) return;
      this.$emit("close");
    };
    // Close the modal when the
    // user presses the ESC key.
    document.addEventListener("keyup", close);
    this.$on("hook:destroyed", () => {
      document.removeEventListener("keyup", close);
    });
  },
  methods: {
    handleClickOutside() {
      if (this.persistent) return;

      this.$emit("click:outside");
    }
  }
};
</script>
