<template>
  <v-container fluid>
    <v-row justify="center">
      <component :is="component" height="200" />
    </v-row>
    <v-row justify="center" class="mt-6">
      <p><slot></slot></p>
    </v-row>
  </v-container>
</template>

<script>
import { UndrawFactory } from "@/factories/undrawFactory";

export default {
  name: "Placeholder",
  props: {
    height: {
      type: Number || String,
      default: 200
    },
    name: {
      type: String,
      required: true
    }
  },
  data: () => ({
    component: null
  }),
  created() {
    UndrawFactory.get(this.name).then(resolvedComponent => {
      this.component = resolvedComponent["default"];
    });
  }
};
</script>
