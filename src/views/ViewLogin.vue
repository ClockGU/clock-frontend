<template>
  <v-row
    :align="mdAndUp ? 'center' : null"
    :justify="mdAndUp ? 'center' : null"
  >
    <v-col cols="12" md="6" class="py-0">
      <LoginForm />
    </v-col>
  </v-row>
</template>

<script>
import LoginForm from "@/components/LoginForm.vue";
import { useDisplay } from "vuetify";

export default {
  name: "ViewLogin",
  components: { LoginForm },
  computed: {
    mdAndUp() {
      const { mdAndUp } = useDisplay();
      return mdAndUp.value;
    },
  }
};
</script>
