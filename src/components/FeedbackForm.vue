<template>
  <v-card>
    <v-card-title>Feedback</v-card-title>
    <v-card-text>
      <p>
        Send us any feedback you have. We appreciate all comments!
      </p>
      <v-form>
        <v-text-field
          v-model="name"
          label="Name"
          :error-messages="nameErrors"
          @blur="$v.name.$touch()"
        ></v-text-field>

        <v-text-field
          v-model="email"
          label="E-Mail"
          :error-messages="emailErrors"
          @blur="$v.email.$touch()"
        ></v-text-field>

        <v-select
          v-model="topic"
          :items="availableTopics"
          label="Topic"
        ></v-select>

        <v-textarea
          v-model="message"
          label="Message"
          :error-messages="messageErrors"
          @blur="$v.message.$touch()"
        ></v-textarea>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn text @click="close">Cancel</v-btn>
      <v-btn color="primary" text :disabled="$v.$invalid" @click="submit">
        Send
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";
import { mapGetters } from "vuex";

import FeedbackService from "@/services/feedback";

export default {
  name: "FeedbackForm",
  mixins: [validationMixin],
  validations: {
    email: { required, email },
    name: { required },
    message: { required }
  },
  data: () => ({
    name: null,
    email: null,
    message: null,
    topic: "General",
    availableTopics: ["Bug report", "Feature request", "Question", "General"]
  }),
  computed: {
    ...mapGetters({
      user: "user"
    }),
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push("Must be valid e-mail");
      !this.$v.email.required && errors.push("E-mail is required");
      return errors;
    },
    nameErrors() {
      const errors = [];
      if (!this.$v.name.$dirty) return errors;
      !this.$v.name.required && errors.push("Name is required");
      return errors;
    },
    messageErrors() {
      const errors = [];
      if (!this.$v.message.$dirty) return errors;
      !this.$v.message.required && errors.push("Message is required");
      return errors;
    }
  },
  mounted() {
    this.initialize();

    const close = e => {
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
        this.$v.$reset();
      }, 400);
    },
    async submit() {
      const feedback = {
        name: this.name,
        email: this.email,
        title: this.topic,
        message: this.message
      };

      const response = await FeedbackService.post(feedback);

      if (response.status === 200) {
        await this.$store.dispatch("snackbar/setSnack", {
          snack: "Message sent. Thank you!",
          timeout: 4000,
          color: "success"
        });
        this.close();
      } else {
        await this.$store.dispatch("snackbar/setSnack", {
          snack: "Please try again later.",
          timeout: 4000,
          color: "error"
        });
      }
    }
  }
};
</script>
