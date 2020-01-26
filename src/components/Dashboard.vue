<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card :elevation="$vuetify.breakpoint.smAndDown ? 0 : null">
          <v-card-title>Dashboard</v-card-title>
          <v-card-text>Some text</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Dashboard"
};
</script>
