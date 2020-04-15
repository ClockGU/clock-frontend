<template>
  <v-form>
    <v-card :elevation="$vuetify.breakpoint.mdAndUp ? 0 : null">
      <v-card-text :class="$vuetify.breakpoint.mdAndUp ? 'pa-0' : ''">
        <v-fade-transition>
          <v-overlay v-if="loading" absolute color="#036358">
            <v-progress-circular indeterminate size="64"></v-progress-circular>
          </v-overlay>
        </v-fade-transition>

        <v-subheader>Confirm your current password</v-subheader>

        <v-text-field
          id="currentPassword"
          v-model="passwords.currentPassword"
          label="Current password"
          name="password"
          :prepend-icon="icons.mdiLock"
          type="password"
          :error-messages="oldPasswordErrors"
          @blur="$v.passwords.currentPassword.$touch()"
          @keyup.enter="submit"
        ></v-text-field>

        <v-subheader>Enter the new password and repeat it</v-subheader>

        <v-text-field
          id="newPassword"
          v-model="passwords.newPassword"
          label="New password"
          name="password"
          :prepend-icon="icons.mdiLock"
          :type="newPasswordVisible ? 'text' : 'password'"
          :append-icon="newPasswordVisible ? icons.mdiEye : icons.mdiEyeOff"
          :error-messages="newPasswordErrors"
          @blur="$v.passwords.newPassword.$touch()"
          @keyup.enter="submit"
          @click:append="newPasswordVisible = !newPasswordVisible"
        ></v-text-field>

        <v-text-field
          id="newPasswordRepeat"
          v-model="passwords.newPasswordRepeat"
          label="Repeat new password"
          name="password"
          :prepend-icon="icons.mdiLock"
          type="password"
          :error-messages="newPasswordRepeatErrors"
          @blur="$v.passwords.newPasswordRepeat.$touch()"
          @keyup.enter="submit"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" :disabled="!valid" text @click.native="submit">
          Submit
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, minLength } from "vuelidate/lib/validators";
import AuthService from "@/services/auth";

import { mdiLock, mdiEye, mdiEyeOff } from "@mdi/js";

const newPasswordEqualsRepeatPassword = (value, vm) =>
  value === vm.newPasswordRepeat;
const repeatPasswordEqualsNewPassword = (value, vm) => value === vm.newPassword;

export default {
  name: "PasswordForm",
  mixins: [validationMixin],
  validations: {
    passwords: {
      currentPassword: { required },
      newPassword: {
        required,
        newPasswordEqualsRepeatPassword,
        minLength: minLength(8)
      },
      newPasswordRepeat: {
        required,
        repeatPasswordEqualsNewPassword,
        minLength: minLength(8)
      }
    }
  },
  data() {
    return {
      icons: {
        mdiLock: mdiLock,
        mdiEye: mdiEye,
        mdiEyeOff: mdiEyeOff
      },
      passwords: {
        currentPassword: null,
        newPassword: null,
        newPasswordRepeat: null
      },
      newPasswordVisible: false,
      loading: false
    };
  },
  computed: {
    valid() {
      const anyEmpty =
        !!this.passwords.currentPassword &&
        !!this.passwords.newPassword &&
        !!this.passwords.newPasswordRepeat;

      return anyEmpty && !this.$v.$error;
    },
    oldPasswordErrors() {
      const errors = [];
      if (!this.$v.passwords.currentPassword.$dirty) return errors;
      !this.$v.passwords.currentPassword.required &&
        errors.push("Your current password is required");
      return errors;
    },
    newPasswordErrors() {
      const errors = [];
      if (!this.$v.passwords.newPassword.$dirty) return errors;
      !this.$v.passwords.newPassword.required &&
        errors.push("A new password is required");
      !this.$v.passwords.newPassword.minLength &&
        errors.push("Your new password must be at least 8 characters long.");

      !this.$v.passwords.newPassword.newPasswordEqualsRepeatPassword &&
        this.$v.passwords.newPasswordRepeat.$dirty &&
        errors.push("The two passwords must match!");
      return errors;
    },
    newPasswordRepeatErrors() {
      const errors = [];
      if (!this.$v.passwords.newPasswordRepeat.$dirty) return errors;
      !this.$v.passwords.newPasswordRepeat.required &&
        errors.push("You must repeat your new password");
      !this.$v.passwords.newPasswordRepeat.minLength &&
        errors.push("Your new password must be at least 8 characters long.");

      !this.$v.passwords.newPasswordRepeat.repeatPasswordEqualsNewPassword &&
        errors.push("The two passwords must match!");
      return errors;
    }
  },
  methods: {
    submit() {
      this.$v.$touch();
      if (this.$v.$invalid) return;

      this.$store.dispatch("auth/REFRESH_TOKEN").then(() => {
        AuthService.changePassword(
          this.passwords.currentPassword,
          this.passwords.newPassword
        ).then(() => {
          this.$store.dispatch("auth/LOGOUT");
        });
      });
    }
  }
};
</script>
