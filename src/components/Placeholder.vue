<template>
  <v-container fluid>
    <v-row justify="center">
      <p><slot></slot></p>
    </v-row>
    <v-row justify="center">
      <component :is="undrawComponent" height="200" />
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Placeholder",
  props: {
    height: {
      type: Number || String,
      default: 200
    },
    component: {
      type: String,
      required: true
    }
  },
  computed: {
    undrawComponent() {
      return () => import(`vue-undraw/${this.component}.vue`);
    }
  }
};
</script>
