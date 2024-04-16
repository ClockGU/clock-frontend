<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card height="400">
          <v-row justify="center" align-content="center" style="height: 100%">
            <div>
              <v-progress-circular
                :size="70"
                :width="7"
                color="primary"
                indeterminate
              ></v-progress-circular>
              <div>{{ text }}</div>
            </div>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "LoadingAnimation",
  props: {
    text: {
      type: String,
      default: "",
      required: false
    }
  }
};
</script>

<style scoped></style>
