<template>
  <v-container>
    <v-layout wrap justify-center>
      <v-flex xs12 md8 lg10>
        <v-text-field
          v-model="username"
          label="Username"
          @keyup.enter="submit"
        ></v-text-field>
        <v-text-field
          v-model="password"
          label="Password"
          type="password"
          @keyup.enter="submit"
        ></v-text-field>
        <v-btn @click="submit">Login</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: "LoginView",
  data: () => ({
    username: null,
    password: null
  }),
  methods: {
    submit() {
      this.$store.dispatch("auth/login", {
        email: this.username,
        password: this.password
      });
    }
  }
};
</script>
