<template>
  <a
    class="link blue-grey--text text--darken-4 font-weight-medium"
    :href="href"
  >
    <slot name="text"></slot>
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
  }
};
</script>

<style lang="scss" scoped>
.link {
  border-bottom: 2px solid #82b1ff;
  border-bottom-width: 50%;
  background: linear-gradient(#82b1ff, #82b1ff 100%) bottom no-repeat;
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
