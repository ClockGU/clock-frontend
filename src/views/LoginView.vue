<template>
  <v-container>
    <v-layout wrap justify-center>
      <v-flex xs12 md8 lg10>
        <v-text-field v-model="username" label="Username"></v-text-field>
        <v-text-field
          v-model="password"
          label="Password"
          type="password"
        ></v-text-field>
        <v-btn @click="submit">Login</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "LoginView",
  data: () => ({
    username: null,
    password: null
  }),
  methods: {
    ...mapActions("auth", ["login"]),
    submit() {
      this.login({ email: this.username, password: this.password });
    }
  }
};
</script>
