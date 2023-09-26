<template>
  <a :class="'link font-weight-medium ' + textColor" :href="href">
    <slot></slot>
  </a>
</template>

<script>
export default {
  name: "Link",
  props: {
    href: {
      type: String,
      required: true
    }
  },
  computed: {
    primaryColor() {
      return this.$vuetify.theme.currentTheme.primary;
    },
    colorModification() {
      return this.$vuetify.theme.dark ? "lighten-2" : "darken-2";
    },
    textColor() {
      return "primary--text" + " " + "text--" + this.colorModification;
    }
  }
};
</script>

<style lang="scss" scoped>
.self {
}
.link {
  border-radius: 100% 100% 0 0;
  border-bottom: 2px solid var(--v-primary-base);
  border-bottom-width: 50%;
  background: radial-gradient(
      ellipse at 50% 100%,
      var(--v-primary-base),
      rgb(0, 0, 0, 0)
    )
    bottom no-repeat;
  background-size: 100% 0;
  transition: background-size 0.1s;
  text-decoration: unset;
  padding-top: 5px;
}
.link:hover,
.link:active {
  background-size: 100% 110%;
  text-decoration: none;
}
</style>
