<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="8" md="7">
      <LoginForm />
    </v-col>
  </v-row>
</template>

<script>
import LoginForm from "@/components/LoginForm";

export default {
  name: "ViewLogin",
  components: { LoginForm }
};
</script>
