<template>
  <TheDialog :persistent="false" :max-width="maxWidth">
    <template #activator="{ on }">
      <slot name="activator" :on="on"></slot>
    </template>

    <template #content="{ events: { close } }">
      <v-card data-cy="delete-dialog">
        <v-card-title>
          <slot name="title"></slot>
        </v-card-title>

        <v-card-text>
          <slot name="text"></slot>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            v-bind="confirmationObject.attrs"
            data-cy="delete-confirm"
            :color="confirmationObject.color"
            text
            @click="confirm(close)"
          >
            {{ confirmationObject.text }}
          </v-btn>
          <v-btn
            v-bind="cancelObject.attrs"
            data-cy="delete-cancel"
            :color="cancelObject.color"
            text
            @click="close"
          >
            {{ cancelObject.text }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </TheDialog>
</template>

<script>
import TheDialog from "@/components/TheDialog";

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
      default: 290
    }
  },
  data: () => ({
    dialog: false
  }),
  computed: {
    confirmationObject() {
      return {
        text: this.$t("actions.delete"),
        ...this.confirmationButton,
        onClickHandler:
          this.confirmationButton.onClickHandler === null ||
          this.confirmationButton.onClickHandler === undefined
            ? this.confirm
            : this.confirmationButton.onClickHandler
      };
    },
    cancelObject() {
      return {
        text: this.$t("actions.cancel"),
        ...this.cancelButton
      };
    }
  },
  methods: {
    confirm(closeFn) {
      this.$emit("confirm");
      closeFn();
    }
  }
};
</script>
