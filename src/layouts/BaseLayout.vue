<template>
  <v-container>
    <v-row
      class="mx-0"
      :align="$vuetify.breakpoint.mdAndUp ? 'center' : null"
      :justify="$vuetify.breakpoint.mdAndUp ? 'center' : null"
    >
      <v-col cols="12" md="8" :class="colClasses" class="px-0">
        <v-card :elevation="cardElevation">
          <slot name="card-top"></slot>

          <portal
            :to="
              $vuetify.breakpoint.smAndDown
                ? 'app-bar'
                : alternativePortalTarget
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

          <v-card-text class="px-0">
            <slot name="content"></slot>
          </v-card-text>
        </v-card>
      </v-col>

      <slot name="extra-content"></slot>
    </v-row>
  </v-container>
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
      default: 0
    },
    colClasses: {
      type: String,
      default: ""
    },
    toolbarElevation: {
      type: Number,
      default: 0
    }
  }
};
</script>
