<template>
  <TheDialog :persistent="false" :max-width="maxWidth">
    <template #activator="props">
      <slot name="activator" v-bind="props"></slot>
    </template>

    <template #content="{ events: { close } }">
      <v-card data-cy="delete-dialog">
        <v-card-title>
          <slot name="title"></slot>
        </v-card-title>

        <v-card-text>
          <slot name="text"></slot>
        </v-card-text>

        <v-card-text class="text-error">
          <slot name="consequencesText"></slot>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            v-bind="confirmationButton.attrs"
            data-cy="delete-confirm"
            :color="confirmationButton.color"
            variant="text"
            @click="confirm(close)"
          >
            {{ confirmationButton.text }}
          </v-btn>
          <v-btn
            v-bind="cancelButton.attrs"
            data-cy="delete-cancel"
            :color="cancelButton.color"
            variant="text"
            @click="close"
          >
            {{ $t("actions.cancel") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </TheDialog>
</template>

<script>
import TheDialog from "@/components/TheDialog.vue";

export default {
  name: "ConfirmationDialog",
  components: { TheDialog },
  props: {
    confirmationButton: {
      type: Object,
      default: () => {
        return {
          color: "error",
          attrs: {},
          onClickHandler: null
        };
      }
    },
    cancelButton: {
      type: Object,
      default: () => {
        return {
          color: "",
          attrs: {}
        };
      }
    },
    maxWidth: {
      type: Number,
      default: 400
    }
  },
  data: () => ({
    dialog: false
  }),
  methods: {
    confirm(closeFn) {
      if (
        this.confirmationButton.onClickHandler !== null &&
        this.confirmationButton.onClickHandler !== undefined
      ) {
        this.confirmationButton.onClickHandler();
      }
      this.$emit("confirm");
      closeFn();
    }
  }
};
</script>
