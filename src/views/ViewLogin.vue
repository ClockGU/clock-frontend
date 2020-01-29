<template>
  <v-row
    :align="$vuetify.breakpoint.mdAndUp ? 'center' : ''"
    :justify="$vuetify.breakpoint.mdAndUp ? 'center' : ''"
  >
    <v-col cols="12" md="6" class="py-0">
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
