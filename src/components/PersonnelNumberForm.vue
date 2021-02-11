<template>
  <v-card :loading="loading" elevation="0">
    <v-card-title>{{ $t("onboarding.personnelNumber.label") }}</v-card-title>

    <v-card-text>
      <p>
        {{ $t("onboarding.personnelNumber.hint") }}
      </p>

      <v-form>
        <v-text-field
          v-model="personnelNumber"
          :disabled="loading"
          :error-messages="personnelErrors"
          @blur="$v.personnelNumber.$touch()"
        ></v-text-field>
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-btn
        color="primary"
        :disabled="loading || $v.$error"
        :loading="loading"
        required
        text
        @click="save"
      >
        {{ $t("actions.save") }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import AuthService from "@/services/auth";
import { validationMixin } from "vuelidate";
import { required, minLength } from "vuelidate/lib/validators";
import { log } from "@/utils/log";

export default {
  name: "PersonnelNumberForm",
  mixins: [validationMixin],
  validations: {
    personnelNumber: {
      required,
      minLength: minLength(5)
    }
  },
  data: () => ({
    loading: false,
    personnelNumber: null
  }),
  computed: {
    personnelErrors() {
      const errors = [];
      if (!this.$v.personnelNumber.$dirty) return errors;
      !this.$v.personnelNumber.required &&
        errors.push(
          this.$tc("errors.nameRequired", 1, {
            name: this.$t("onboarding.personnelNumber.label")
          })
        );

      !this.$v.personnelNumber.minLength &&
        errors.push(
          this.$t("errors.minLength", {
            name: this.$t("onboarding.personnelNumber.label"),
            length: 5
          })
        );

      return errors;
    }
  },
  created() {
    this.personnelNumber = this.$store.state.user.personal_number;
  },
  methods: {
    async save() {
      this.$v.$touch();
      if (this.$v.$invalid) return;

      this.loading = true;
      try {
        await AuthService.updateSettings({
          personal_number: this.personnelNumber
        });

        await this.$store.dispatch("GET_USER");

        this.$store.dispatch("snackbar/setSnack", {
          snack: this.$t("snackbar.success"),
          timeout: 4000,
          color: "success"
        });
      } catch (error) {
        this.$store.dispatch("snackbar/setSnack", {
          snack: this.$t("snackbar.error"),
          timeout: 4000,
          color: "warning"
        });

        // TODO: Set error state
        log(error);
      } finally {
        setTimeout(() => {
          this.loading = false;
        }, 500);
      }
    }
  }
};
</script>
