<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$vuetify.breakpoint.smAndDown"
    max-width="600"
    persistent
    no-click-animation
    @keydown.esc="closeDialog"
  >
    <v-card>
      <v-toolbar flat>
        <v-btn v-if="$vuetify.breakpoint.smAndDown" icon @click="closeDialog">
          <v-icon>{{ icons.mdiClose }}</v-icon>
        </v-btn>
        <v-toolbar-title>
          {{ uuid !== null ? `Update ${entityName}` : `Create ${entityName}` }}
        </v-toolbar-title>
        <v-spacer v-if="$vuetify.breakpoint.smAndDown"></v-spacer>
        <v-toolbar-items v-if="$vuetify.breakpoint.smAndDown">
          <ConfirmationDialog @confirm="destroy">
            <template v-slot:activator="{ on }">
              <v-btn v-if="uuid !== null" icon v-on="on">
                <v-icon>{{ icons.mdiDelete }}</v-icon>
              </v-btn>
            </template>

            <template v-slot:title>Delete {{ entityName }}?</template>

            <template v-slot:text>
              Deleting the {{ entityName }} is a permanent action.
            </template>
          </ConfirmationDialog>

          <v-btn
            text
            :disabled="!formValid"
            @click="uuid === null ? save() : update()"
          >
            Save
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text class="pb-0">
        <component
          :is="formComponent"
          :entity="entity"
          :uuid="uuid"
          :now="now"
          @cancel="closeDialog"
          @destroy="destroy"
          @save="save"
          @update="updateData"
        />
      </v-card-text>

      <v-card-actions v-if="$vuetify.breakpoint.mdAndUp">
        <v-btn
          data-cy="entity-save"
          text
          :disabled="!formValid"
          color="primary"
          @click="uuid === null ? save() : update()"
        >
          Save
        </v-btn>
        <v-btn data-cy="entity-cancel" text @click="closeDialog">
          Cancel
        </v-btn>

        <v-spacer></v-spacer>

        <ConfirmationDialog @confirm="destroy">
          <template v-slot:activator="{ on }">
            <v-btn
              data-cy="entity-form-delete-button"
              text
              color="error"
              v-on="on"
            >
              Delete
            </v-btn>
          </template>

          <template v-slot:title>Delete {{ entityName }}?</template>

          <template v-slot:text>
            Deleting the {{ entityName }} is a permanent action.
          </template>
        </ConfirmationDialog>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { handleApiError } from "@/utils/interceptors";
import { mdiDelete, mdiClose } from "@mdi/js";

import ConfirmationDialog from "@/components/ConfirmationDialog";

export default {
  name: "FormDialog",
  components: { ConfirmationDialog },
  props: {
    now: {
      type: Date,
      default: () => new Date()
    },
    entity: {
      type: Object || null,
      default: null
    },
    entityName: {
      type: String,
      required: true
    },
    formPath: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    confirmDialog: false,
    formValid: true,
    dialog: true,
    icons: {
      mdiDelete,
      mdiClose
    },
    toSave: null,
    service: null
  }),
  computed: {
    formComponent() {
      return () =>
        import(`@/components/${this.formPath[0]}/${this.formPath[1]}.vue`);
    },
    serviceLoader() {
      return () => import(`@/services/${this.entityName}.js`);
    },
    uuid() {
      return this.entity === null ? null : this.entity.uuid;
    }
  },
  created() {
    // Load the entity service
    this.loadService();
    // Make a copy of the entity we will save.
    this.toSave = this.entity;
  },
  methods: {
    loadService() {
      this.serviceLoader().then(service => {
        this.service = service["default"];
      });
    },
    updateData(event) {
      this.toSave = event[this.entityName];
      this.formValid = event.valid;
    },
    closeDialog() {
      this.$emit("close");
    },
    destroy() {
      this.service
        .delete(this.toSave.uuid)
        .then(() => {
          this.$emit("refresh");
        })
        .catch(handleApiError)
        .finally(() => {
          this.closeDialog();
        });
    },
    update() {
      this.service
        .update(this.toSave.toPayload(), this.toSave.uuid)
        .then(() => {
          this.$emit("refresh");
        })
        .then(() => {
          this.closeDialog();
        })
        .catch(handleApiError);
    },
    save() {
      this.service
        .create(this.toSave.toPayload())
        .then(() => {
          this.$emit("refresh");
        })
        .then(() => {
          this.closeDialog();
        })
        .catch(handleApiError);
    }
  }
};
</script>
