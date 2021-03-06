<template>
  <v-form>
    <v-card :elevation="$vuetify.breakpoint.smAndDown ? 0 : null">
      <portal-target name="card-toolbar"></portal-target>

      <portal :to="$vuetify.breakpoint.smAndDown ? 'app-bar' : 'card-toolbar'">
        <v-toolbar :elevation="0">
          <v-toolbar-title> Login Form </v-toolbar-title>
        </v-toolbar>
      </portal>

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
          :prepend-icon="icons.mdiAccount"
          type="text"
          autocomplete="email"
          autofocus
          :error-messages="emailErrors"
          @blur="$v.email.$touch()"
          @keyup.enter="submit"
        ></v-text-field>

        <v-text-field
          id="password"
          v-model="password"
          label="Password"
          name="password"
          :prepend-icon="icons.mdiLock"
          :type="showPassword ? 'text' : 'password'"
          :append-icon="showPassword ? icons.mdiEye : icons.mdiEyeOff"
          :error-messages="passwordErrors"
          @blur="$v.password.$touch()"
          @keyup.enter="submit"
          @click:append="showPassword = !showPassword"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" :disabled="$v.$error" text @click.native="submit"
          >Login</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";
import { mdiAccount, mdiLock, mdiEye, mdiEyeOff } from "@mdi/js";

export default {
  name: "LoginForm",
  mixins: [validationMixin],
  validations: {
    email: { required, email },
    password: { required }
  },
  data: () => ({
    icons: {
      mdiAccount: mdiAccount,
      mdiLock: mdiLock,
      mdiEye: mdiEye,
      mdiEyeOff: mdiEyeOff
    },
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
      if (this.$v.$invalid) return;

      try {
        this.loading = true;

        const { data } = await this.$store.dispatch("auth/LOGIN", {
          email: this.email.toLowerCase(),
          password: this.password
        });

        this.$i18n.locale = data.language || "de";

        this.$router
          .push({
            name: "dashboard"
          })
          .catch(() => {});
      } catch (error) {
        this.$store.dispatch("snackbar/setSnack", {
          snack:
            "Something went wrong with the login. Please contact the support, if this keeps happening.",
          color: "error"
        });
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
