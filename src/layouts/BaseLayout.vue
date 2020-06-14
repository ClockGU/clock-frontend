<template>
  <v-row
    class="mx-0"
    :align="$vuetify.breakpoint.mdAndUp ? 'center' : null"
    :justify="$vuetify.breakpoint.mdAndUp ? 'center' : null"
  >
    <v-col cols="12" md="6" :class="columnClasses">
      <v-card :elevation="cardElevation">
        <slot name="card-top"></slot>

        <portal
          :to="
            $vuetify.breakpoint.smAndDown ? 'app-bar' : alternativePortalTarget
          "
        >
          <v-toolbar slot-scope="{ action }" :elevation="toolbarElevation">
            <slot name="pre-toolbar-title" :action="() => action()">
              <v-app-bar-nav-icon
                v-if="$vuetify.breakpoint.smAndDown"
                icon
                @click="action"
              ></v-app-bar-nav-icon>
            </slot>

            <v-toolbar-title>
              <slot name="title"></slot>
            </v-toolbar-title>

            <slot name="post-toolbar-title"></slot>
          </v-toolbar>
        </portal>

        <v-card-text>
          <slot name="content"></slot>
        </v-card-text>
      </v-card>
    </v-col>

    <slot name="extra-content"></slot>
  </v-row>
</template>

<script>
export default {
  name: "BaseLayout",
  props: {
    alternativePortalTarget: {
      type: String,
      default: ""
    },
    cardElevation: {
      type: Number,
      default: null
    },
    colClasses: {
      type: String,
      default: ""
    },
    toolbarElevation: {
      type: Number,
      default: 0
    }
  },
  computed: {
    columnClasses() {
      // px-0 is important! Users can scroll in the x-direction if we do not use
      // it.
      return [...this.colClasses, "py-0", "px-0"];
    }
  }
};
</script>
