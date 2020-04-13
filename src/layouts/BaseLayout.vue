<template>
  <v-row justify="center">
    <v-col cols="12" md="6">
      <v-card>
        <portal :to="$vuetify.breakpoint.smAndDown ? 'app-bar' : ''">
          <v-toolbar slot-scope="{ action }" :elevation="0">
            <v-app-bar-nav-icon
              v-if="$vuetify.breakpoint.smAndDown"
              icon
              @click="action"
            ></v-app-bar-nav-icon>

            <v-toolbar-title>
              <slot name="title"></slot>
            </v-toolbar-title>

            <slot name="extra-toolbar"></slot>
          </v-toolbar>
        </portal>

        <v-card-text>
          <slot name="text"></slot>
        </v-card-text>
      </v-card>
    </v-col>

    <slot name="extra-content"></slot>
  </v-row>
</template>

<script>
export default {
  name: "BaseLayout"
};
</script>
