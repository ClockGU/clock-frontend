<template>
  <TheDialog
    v-model="dialog"
    :persistent="false"
    :max-width="maxWidth"
    @close="cancel"
    @click:outside="cancel"
  >
    <template v-slot:activator="{ on }">
      <slot name="activator" :on="on"></slot>
    </template>

    <template v-slot:content>
      <v-card data-cy="delete-dialog">
        <v-card-title>
          <span class="text-h5">
            <slot name="title"></slot>
          </span>
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
            @click="confirmationObject.onClickHandler"
          >
            {{ confirmationObject.text }}
          </v-btn>
          <v-btn
            v-bind="cancelObject.attrs"
            data-cy="delete-cancel"
            :color="cancelObject.color"
            text
            @click="cancel"
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
    cancel() {
      this.$emit("cancel");
      this.close();
    },
    close() {
      this.dialog = false;
    },
    confirm() {
      this.$emit("confirm");
      this.close();
    }
  }
};
</script>
