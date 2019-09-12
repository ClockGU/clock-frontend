<template>
  <v-form>
    <v-card class="elevation-12">
      <v-toolbar color="yellow darken-3" dark flat>
        <v-toolbar-title>Login form</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-fade-transition>
          <v-overlay v-if="loading" absolute color="#036358">
            <v-progress-circular indeterminate size="64"></v-progress-circular>
          </v-overlay>
        </v-fade-transition>

        <v-text-field
          v-model="email"
          required
          label="E-mail"
          name="email"
          prepend-icon="person"
          type="text"
          autocomplete="email"
          :error-messages="emailErrors"
          @blur="$v.email.$touch()"
          @keyup.enter="submit"
        ></v-text-field>

        <v-text-field
          id="password"
          v-model="password"
          label="Password"
          name="password"
          prepend-icon="lock"
          :type="showPassword ? 'text' : 'password'"
          :append-icon="showPassword ? 'visibility' : 'visibility_off'"
          :error-messages="passwordErrors"
          @blur="$v.password.$touch()"
          @keyup.enter="submit"
          @click:append="showPassword = !showPassword"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="yellow darken-3"
          :disabled="$v.$error"
          @click.native="submit"
          >Login</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";

export default {
  name: "LoginForm",
  mixins: [validationMixin],
  validations: {
    email: { required, email },
    password: { required }
  },
  data: () => ({
    email: null,
    password: null,
    showPassword: false,
    loading: false
  }),
  computed: {
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push("Must be valid e-mail");
      !this.$v.email.required && errors.push("E-mail is required");
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.required && errors.push("Password is required");
      return errors;
    }
  },
  methods: {
    async submit() {
      this.$v.$touch();

      if (!this.$v.$error) {
        this.loading = true;

        // try {
        new Promise(resolve => {
          return this.$store
            .dispatch("auth/login", {
              email: this.email,
              password: this.password
            })
            .then(() => {
              this.loading = false;
              resolve();
            })
            .catch(error => {
              this.$store.dispatch("snackbar/setSnack", {
                snack: error.message,
                timeout: 0,
                color: "error"
              });
            })
            .finally(() => (this.loading = false));
        });
      }
    }
  }
};
</script>
