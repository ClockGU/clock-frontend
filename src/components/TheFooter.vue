<template>
  <v-footer color="primary darken-2" dark min-height="72">
    <v-container>
      <v-row>
        <v-col class="text-center text-md-right" cols="12" md="6">
          Copyright &copy; 2020
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
export default {
  name: "TheFooter",
  data: () => ({
    links: ["Home", "About Us", "Team", "Services", "Blog", "Contact Us"]
  })
};
</script>
