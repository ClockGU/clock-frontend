<template>
  <v-card :loading="loading" elevation="0">
    <v-card-title>{{ $t("settings.account.dialogTitle") }}</v-card-title>

    <v-card-text>
      <p>
        {{ $t("settings.account.text") }}
      </p>
    </v-card-text>

    <v-card-actions>
      <ConfirmationDialog
        :confirmation-button="{
          attrs: { disabled: $v.$invalid },
          color: 'error',
          onClickHandler: destroy
        }"
        @cancel="resetForm"
      >
        <template #activator="{ on }">
          <v-btn text color="error" v-on="on">
            {{ $t("actions.delete") }}
          </v-btn>
        </template>

        <template #title>
          {{ $t("settings.account.dialogTitle") }}
        </template>

        <template #text>
          <i18n path="settings.account.dialogText" tag="span">
            <template #email>
              <strong>{{ user.email }}</strong>
            </template>
          </i18n>

          <v-text-field
            v-model="email"
            required
            :label="$t('feedback.fields.email')"
            name="email"
            :prepend-icon="icons.mdiEmail"
            type="text"
            autocomplete="email"
            :error-messages="emailErrors"
            @blur="$v.email.$touch()"
            @keyup.enter="destroy"
          ></v-text-field>
        </template>
      </ConfirmationDialog>
    </v-card-actions>
  </v-card>
</template>

<script>
import AuthService from "@/services/auth";
import ConfirmationDialog from "@/components/ConfirmationDialog";
// import { validationMixin } from "vuelidate";
// import { required, email, sameAs } from "vuelidate/lib/validators";
import { mapGetters } from "vuex";
import { mdiEmail } from "@mdi/js";

export default {
  name: "DeleteAccount",
  components: { ConfirmationDialog },
  // mixins: [validationMixin],
  // validations: {
  //   email: {
  //     required,
  //     email,
  //     sameAs: sameAs(function () {
  //       return this.user.email;
  //     })
  //   }
  // },
  data: () => ({
    email: "",
    icons: { mdiEmail },
    loading: false
  }),
  computed: {
    ...mapGetters({
      user: "user"
    }),
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push(this.$t("errors.validEmail"));
      !this.$v.email.required &&
        errors.push(
          this.$tc("errors.nameRequired", 1, {
            name: this.$t("feedback.fields.email")
          })
        );
      !this.$v.email.sameAs && errors.push(this.$t("errors.matchEmail"));
      return errors;
    }
  },
  methods: {
    async destroy() {
      this.$v.$touch();
      if (this.$v.$invalid) return;

      this.loading = true;
      try {
        await AuthService.deleteAccount();
        this.$store.dispatch("auth/LOGOUT");
      } catch (error) {
        this.$store.dispatch("snackbar/setSnack", {
          snack: this.$t("settings.account.tryAgainLater"),
          timeout: 4000,
          color: "error"
        });
      }
      this.loading = false;
    },
    resetForm() {
      setTimeout(() => {
        this.email = null;
        this.$v.$reset();
      }, 400);
    }
  }
};
</script>
