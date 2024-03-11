<template>
  <v-container class="px-0">
    <v-row class="px-0">
      <v-col cols="12" class="pa-8">
        <div class="d-flex align-content-center justify-center">
          <component
            :is="component"
            :class="[$vuetify.theme.current.dark ? 'undraw-background' : '']"
            height="200"
            style="box-shadow: 0 0 20px 10px white"
          />
        </div>
      </v-col>
    </v-row>
    <v-row class="px-0" justify="center">
      <v-col cols="12" style="text-align: center">
        <p
          :class="
            ($vuetify.theme.current.dark ? 'text-white' : '') + ' p-placeholder'
          "
        >
          <slot></slot>
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { UndrawFactory } from "@/factories/undrawFactory";
import { markRaw } from "vue";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
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

<style lang="scss" scoped>
.p-placeholder {
  font-size: 0.875rem;
  line-height: 1.375rem;
  font-weight: 400;
  letter-spacing: 0.0071428571em;
}

.undraw-background {
  background-color: hsl(0, 0, 33);
  border-color: white;
}
</style>
