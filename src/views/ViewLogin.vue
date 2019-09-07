<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="8" md="7">
      <v-fade-transition>
        <v-banner v-if="loginError" elevation="6"
          >The e-mail and/or password you entered is not valid.

          <template v-slot:actions="{ dismiss }">
            <v-btn icon text color="deep-purple accent-4" @click="dismiss">
              <v-icon>close</v-icon>
            </v-btn>
          </template>
        </v-banner>
      </v-fade-transition>
    </v-col>

    <v-col cols="12" sm="8" md="7">
      <LoginForm />
    </v-col>
  </v-row>
</template>

<script>
import LoginForm from "@/components/LoginForm";

export default {
  name: "ViewLogin",
  components: { LoginForm },
  computed: {
    loginError() {
      return !!this.$store.state.auth.authenticationError;
    }
  }
};
</script>
