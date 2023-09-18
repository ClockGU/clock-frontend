<template>
  <v-card>
    <v-card-title>
      {{ $t("feedback.title") }}
    </v-card-title>
    <v-card-text>
      <p>
        {{ $t("feedback.text") }}
      </p>
      <v-form>
        <v-text-field
          v-model="name"
          :label="$t('feedback.fields.name')"
          :error-messages="nameErrors"
          @blur="v$.name.$touch()"
        ></v-text-field>

        <v-text-field
          v-model="email"
          :label="$t('feedback.fields.email')"
          :error-messages="emailErrors"
          @blur="v$.email.$touch()"
        ></v-text-field>

        <v-select
          v-model="topic"
          :items="availableTopics"
          :label="$t('feedback.fields.topic')"
        ></v-select>

        <v-textarea
          v-model="message"
          rows="3"
          :label="$t('feedback.fields.message')"
          :error-messages="messageErrors"
          @blur="v$.message.$touch()"
        ></v-textarea>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn variant="text" @click="close">
        {{ $t("actions.cancel") }}
      </v-btn>
      <v-btn
        color="primary"
        variant="text"
        :disabled="v$.$invalid"
        @click="submit"
      >
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
  name: "FeedbackForm",
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
    availableTopics() {
      return [
        {
          text: this.$t("feedback.topics.bug"),
          value: "bug"
        },
        {
          text: this.$t("feedback.topics.feature"),
          value: "feature"
        },
        {
          text: this.$t("feedback.topics.question"),
          value: "question"
        },
        {
          text: this.$t("feedback.topics.general"),
          value: "general"
        }
      ];
    },
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
      const feedback = {
        name: this.name,
        email: this.email,
        title: this.topic,
        message: this.message
      };

      try {
        await FeedbackService.post(feedback);

        await this.$store.dispatch("snackbar/setSnack", {
          message: this.$t("feedback.snackbar.success"),
          color: "success"
        });
        this.close();
      } catch (error) {
        await this.$store.dispatch("snackbar/setSnack", {
          message: this.$t("feedback.snackbar.error"),
          color: "error"
        });
      }
    }
  }
};
</script>
