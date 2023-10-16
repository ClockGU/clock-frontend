<template>
  <v-container class="px-0">
    <v-row class="px-0">
      <v-col cols="12">
        <div class="d-flex align-content-center justify-center">
          <component :is="component" height="200"/>
        </div>
      </v-col>
    </v-row>
    <v-row class="px-0" justify="center">
      <v-col cols="12">
        <p class="p-placeholder"><slot></slot></p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { UndrawFactory } from "@/factories/undrawFactory";
import { markRaw } from "vue";

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
    UndrawFactory.get(this.name).then((resolvedComponent) => {
      this.component = markRaw(resolvedComponent["default"]);
    });
  }
};
</script>

<style scoped>
.p-placeholder {
  font-size: .875rem;
  line-height: 1.375rem;
  color: rgb(0,0,0,.6);
  font-weight: 400;
  letter-spacing: .0071428571em;
}
</style>
