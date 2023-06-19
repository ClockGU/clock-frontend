<template>
  <v-card>
    <v-card-title>
      {{ $t("ombuds.title") }}
    </v-card-title>
    <v-card-text>
      <div>
        {{ $t("ombuds.text") }}
      </div>
      <br />
      <div>
        <base-link
          class="text-no-wrap"
          :href="$t('ombuds.url')"
          target="_blank"
        >
          {{ $t("ombuds.linkText") }}
        </base-link>
      </div>
      <br />
      <v-form>
        <v-text-field
          v-model="name"
          :label="$t('ombuds.fields.name')"
          :error-messages="nameErrors"
          @blur="v$.name.$touch()"
        ></v-text-field>

        <v-text-field
          v-model="email"
          :label="$t('ombuds.fields.email')"
          :error-messages="emailErrors"
          @blur="v$.email.$touch()"
        ></v-text-field>

        <v-textarea
          v-model="message"
          rows="3"
          :label="$t('ombuds.fields.message')"
          :error-messages="messageErrors"
          @blur="v$.message.$touch()"
        ></v-textarea>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn text @click="close">
        {{ $t("actions.cancel") }}
      </v-btn>
      <v-btn color="primary" text :disabled="v$.$invalid" @click="submit">
        {{ $t("actions.send") }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import { mapGetters } from "vuex";

import FeedbackService from "@/services/feedback";

export default {
  name: "OmbudsForm",
  setup() {
    return {
      v$: useVuelidate()
    };
  },
  data: () => ({
    name: null,
    email: null,
    message: null,
    topic: "general"
  }),
  validations() {
    return {
      email: { required, email },
      name: { required },
      message: { required }
    };
  },
  computed: {
    ...mapGetters({
      user: "user"
    }),
    emailErrors() {
      const errors = [];
      if (!this.v$.email.$dirty) return errors;
      !this.v$.email.email && errors.push("Must be valid e-mail");
      !this.v$.email.required && errors.push("E-mail is required");
      return errors;
    },
    nameErrors() {
      const errors = [];
      if (!this.v$.name.$dirty) return errors;
      !this.v$.name.required && errors.push("Name is required");
      return errors;
    },
    messageErrors() {
      const errors = [];
      if (!this.v$.message.$dirty) return errors;
      !this.v$.message.required && errors.push("Message is required");
      return errors;
    }
  },
  mounted() {
    this.initialize();

    const close = (e) => {
      const ESC = 27;
      if (e.keyCode !== ESC) return;
      this.close();
    };
    // Close the modal when the
    // user presses the ESC key.
    document.addEventListener("keyup", close);
    this.$on("hook:destroyed", () => {
      document.removeEventListener("keyup", close);
    });
  },
  methods: {
    initialize() {
      this.name = this.user.first_name;
      this.email = this.user.email;
      this.message = null;
    },
    close() {
      this.$emit("close");

      setTimeout(() => {
        this.initialize();
        this.v$.$reset();
      }, 400);
    },
    async submit() {
      const ombuds = {
        name: this.name,
        email: this.email,
        title: "Ombud",
        message: this.message
      };

      try {
        await FeedbackService.post(ombuds);

        await this.$store.dispatch("snackbar/setSnack", {
          message: this.$t("ombuds.snackbar.success"),
          color: "success"
        });
        this.close();
      } catch (error) {
        await this.$store.dispatch("snackbar/setSnack", {
          message: this.$t("ombuds.snackbar.error"),
          color: "error"
        });
      }
    }
  }
};
</script>
