<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="12" md="6" :order="orderPlaceholder">
        <component
          :is="component"
          :height="$vuetify.breakpoint.mdAndUp ? '250' : '200'"
        />
      </v-col>
      <v-col cols="12" sm="12" md="6" :order="orderText">
        <h2><slot name="title"></slot></h2>
        <p v-if="$slots.content">
          <slot name="content"></slot>
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { UndrawFactory } from "@/factories/undrawFactory";

export default {
  name: "HeroPlaceholder",
  props: {
    height: {
      type: Number || String,
      default: 200
    },
    name: {
      type: String,
      required: true
    },
    rtl: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    component: null
  }),
  computed: {
    orderPlaceholder() {
      return this.rtl ? 2 : 1;
    },
    orderText() {
      if (this.$vuetify.breakpoint.smAndDown) return 2;

      return this.rtl ? 1 : 2;
    }
  },
  created() {
    UndrawFactory.get(this.name).then(resolvedComponent => {
      this.component = resolvedComponent["default"];
    });
  }
};
</script>
