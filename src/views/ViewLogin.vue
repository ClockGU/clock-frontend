<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="8" md="4">
      <v-card class="elevation-12">
        <v-toolbar color="yellow darken-3" dark flat>
          <v-toolbar-title>Login form</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-form>
            <v-text-field
              v-model="email"
              label="E-Mail"
              prepend-icon="person"
              type="text"
              @keyup.enter="submit"
            ></v-text-field>

            <v-text-field
              id="password"
              v-model="password"
              label="Password"
              name="password"
              prepend-icon="lock"
              type="password"
              @keyup.enter="submit"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="yellow darken-3">Login</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "ViewLogin",
  data: () => ({
    email: null,
    password: null
  }),
  methods: {
    submit() {
      this.$store.dispatch("auth/login", {
        email: this.email,
        password: this.password
      });
    }
  }
};
</script>
