<template>
  <v-card elevation="0">
    <v-card-title class="text-wrap">Select a UUID of a User to checkout</v-card-title>

    <v-card-text>
      <p>Select a User to view his data for support or debugging purposes</p>
      <v-form>
        <v-text-field v-model="userUUID" class="mt-4"></v-text-field>
      </v-form>
    </v-card-text>

    <v-card-actions>
      <ConfirmationDialog
        :confirmation-button="{ text: 'Checkout', color: 'primary' }"
        :max-width="600"
        @confirm="checkout"
      >
        <template #activator="{ props }">
          <v-btn
            :disabled="userUUID === ''"
            variant="text"
            color="primary"
            v-bind="props"
          >
            Checkout
          </v-btn>
        </template>

        <template #title>Checkout User</template>

        <template #text>
          <v-alert type="warning">
            This function should only be used with the consent of the selected
            user. Proceed?
          </v-alert>
        </template>
      </ConfirmationDialog>

      <v-btn color="alert" variant="text" @click="clear">Clear</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import ApiService from "@/services/api.js";
import ConfirmationDialog from "@/components/ConfirmationDialog.vue";

export default {
  name: "AdminCheckoutUser",
  components: { ConfirmationDialog },
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      userUUID: ""
    };
  },
  watch: {
    value(val) {
      this.userUUID = val;
    }
  },
  created() {
    this.userUUID = this.value;
  },
  methods: {
    checkout() {
      ApiService.setHeader("Checkoutuser", this.userUUID);
      this.$store.commit("auth/SET_CHECKOUT_USER", this.userUUID);
      this.$store.commit("contentData/clearContentData");
    },
    clear() {
      ApiService.removeSingleHeader("Checkoutuser");
      this.$store.commit("auth/CLEAR_CHECKOUT_USER");
      this.$store.commit("contentData/clearContentData");
    }
  }
};
</script>
