<template>
  <v-container>
    <v-row
      class="mx-0"
      :align="mdAndUp ? 'center' : null"
      :justify="mdAndUp ? 'center' : null"
    >
      <v-col cols="12" md="8" :class="colClasses" class="px-0">
        <v-card :elevation="cardElevation">
          <slot name="card-top"></slot>

          <portal
            v-slot="{ action }"
            :to="smAndDown ? 'app-bar' : alternativePortalTarget"
          >
            <v-toolbar :elevation="toolbarElevation">
              <slot name="pre-toolbar-title" :action="() => action()">
                <v-app-bar-nav-icon
                  v-if="smAndDown"
                  variant="flat"
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
  },
  computed: {
    smAndDown() {
      return this.$vuetify.display.smAndDown;
    },
    mdAndUp() {
      return this.$vuetify.display.mdAndUp;
    }
  }
};
</script>
