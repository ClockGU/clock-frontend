<template>
  <TheDialog
    v-model="dialog"
    :persistent="false"
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
          <v-btn data-cy="delete-confirm" color="error" text @click="destroy">
            Delete
          </v-btn>
          <v-btn data-cy="delete-cancel" text @click="cancel">
            Cancel
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
  data: () => ({
    dialog: false
  }),
  methods: {
    cancel() {
      this.$emit("cancel");
      this.close();
    },
    close() {
      this.dialog = false;
    },
    destroy() {
      this.$emit("destroy");
      this.close();
    }
  }
};
</script>
