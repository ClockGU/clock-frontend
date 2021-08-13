<template>
  <v-card elevation="0">
    <v-card-title>Select a UUID of a User to checkout</v-card-title>

    <v-card-text>
      <p>Select a User to get his data for support or debuggin purpose</p>

      <v-form>
        <v-text-field v-model="userUUID"></v-text-field>
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-btn color="primary" text @click="save">
        {{ $t("actions.save") }}
      </v-btn>
      <v-btn color="alert" text @click="clear">
        {{ $t("actions.delete") }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import ApiService from "@/services/api.js";
export default {
  name: "AdminCheckoutUser",
  data() {
    return {
      userUUID: ""
    };
  },
  created() {
    this.userUUID = this.$store.getters.checkoutUser;
  },
  methods: {
    save() {
      ApiService.setHeader("Checkoutuser", this.userUUID);
      this.$store.commit("SET_CHECKOUT_USER", this.userUUID);
    },
    clear() {
      ApiService.removeSingleHeader("Checkoutuser");
      this.$store.commit("CLEAR_CHECKOUT_USER");
    }
  }
};
</script>
