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
          <span class="headline">
            <slot name="title"></slot>
          </span>
        </v-card-title>

        <v-card-text>
          <slot name="text"></slot>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            data-cy="delete-confirm"
            :color="confirmationObject.color"
            text
            @click="confirm"
          >
            {{ confirmationObject.text }}
          </v-btn>
          <v-btn
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
          color: "error"
        };
      }
    },
    cancelButton: {
      type: Object,
      default: () => {
        return {
          color: ""
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
        ...this.confirmationButton
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
