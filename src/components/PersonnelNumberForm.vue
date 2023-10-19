<template>
  <v-card :loading="loading" elevation="0">
    <v-card-title>{{ $t("personnelNumber.label") }}</v-card-title>

    <v-card-text>
      <p>
        {{ $t("personnelNumber.hint") }}
      </p>

      <v-form>
        <v-text-field
          v-model="personnelNumber"
          :disabled="loading"
          :error-messages="personnelErrors"
          @blur="v$.personnelNumber.$touch()"
        ></v-text-field>
      </v-form>
    </v-card-text>

    <v-card-actions v-if="personnelNumberInit == null">
      <v-btn
        color="primary"
        :disabled="loading || v$.$error"
        :loading="loading"
        required
        variant="text"
        @click="save"
      >
        {{ $t("actions.save") }}
      </v-btn>
      <v-btn v-if="dialog" variant="text" @click="$emit('close')">
        {{ $t("actions.cancel") }}
      </v-btn>
    </v-card-actions>
    <v-card-actions v-else>
      <ConfirmationDialog
        :confirmation-button="{ text: $t('actions.change'), color: 'primary' }"
        :max-width="600"
        @confirm="save"
      >
        <template #activator="{ props }">
          <v-btn
            :disabled="
              personnelNumber === personnelNumberInit ||
              personnelNumber === '' ||
              v$.$error
            "
            variant="text"
            color="primary"
            v-bind="props"
          >
            {{ $t("actions.change") }}
          </v-btn>
        </template>

        <template #title>{{ $t("personnelNumber.changeTitle") }}</template>

        <template #text>
          <p>{{ $t("personnelNumber.changeInfo") }}</p>
          <p>{{ $t("personnelNumber.changeConfirmText") }}</p>
        </template>
      </ConfirmationDialog>
    </v-card-actions>
  </v-card>
</template>

<script>
import AuthService from "@/services/auth";
import { required, minLength } from "@vuelidate/validators";
import ConfirmationDialog from "@/components/ConfirmationDialog.vue";
import { log } from "@/utils/log";
import { useVuelidate } from "@vuelidate/core";

export default {
  name: "PersonnelNumberForm",
  props: {
    dialog: Boolean
  },
  validations() {
    return {
      personnelNumber: { required, minLength: minLength(5) }
    };
  },
emits: ['close'],
  setup() {
    return {
      v$: useVuelidate()
    };
  },
  data: () => ({
    loading: false,
    personnelNumber: null,
    personnelNumberInit: null
  }),
  computed: {
    personnelErrors() {
      const errors = [];
      if (!this.v$.personnelNumber.$dirty) return errors;
      !this.v$.personnelNumber.required &&
        errors.push(
          this.$tc("errors.nameRequired", 1, {
            name: this.$t("personnelNumber.label")
          })
        );

      !this.v$.personnelNumber.minLength &&
        errors.push(
          this.$t("errors.minLength", {
            name: this.$t("personnelNumber.label"),
            length: 5
          })
        );

      return errors;
    }
  },
  created() {
    this.personnelNumber = this.$store.state.user.personal_number;
    this.personnelNumberInit =
      this.personnelNumber === "" ? null : this.personnelNumber;
  },
  methods: {
    async save() {
      this.v$.$touch();
      if (this.v$.$invalid) return;

      this.loading = true;
      try {
        await AuthService.updateSettings({
          personal_number: this.personnelNumber
        });

        await this.$store.dispatch("GET_USER");

        this.$store.dispatch("snackbar/setSnack", {
          message: this.$t("snackbar.success"),
          color: "success"
        });
        this.personnelNumberInit = this.personnelNumber;
      } catch (error) {
        this.$store.dispatch("snackbar/setSnack", {
          message: this.$t("snackbar.error"),
          color: "warning"
        });

        // TODO: Set error state
        log(error);
      } finally {
        setTimeout(() => {
          this.loading = false;
        }, 500);
      }
      if (this.dialog) {
        this.$emit("close");
      }
    }
  }
};
</script>
