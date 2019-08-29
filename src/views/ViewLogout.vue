<template>
  <v-container>
    <v-layout wrap justify-center>
      <v-flex xs12 md8 lg10>
        <v-btn @click="submit">Logout</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: "LogoutView",
  data: () => ({
    username: null,
    password: null
  }),
  methods: {
    ...mapActions("auth", ["logout"]),
    submit() {
      this.logout();
    }
  }
};
</script>
