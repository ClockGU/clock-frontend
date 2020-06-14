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
          {{
            uuid !== null
              ? $t("forms.titleUpdate", { entity: $tc(`models.${entityName}`) })
              : $t("forms.titleAdd", { entity: $tc(`models.${entityName}`) })
          }}
        </v-toolbar-title>
        <v-spacer v-if="$vuetify.breakpoint.smAndDown"></v-spacer>
        <v-toolbar-items v-if="$vuetify.breakpoint.smAndDown">
          <ConfirmationDialog @confirm="destroy">
            <template v-slot:activator="{ on }">
              <v-btn v-if="uuid !== null" icon v-on="on">
                <v-icon>{{ icons.mdiDelete }}</v-icon>
              </v-btn>
            </template>

            <template v-slot:title>
              {{
                $t("buttons.deleteEntity", {
                  entity: $tc(`models.${entityName}`)
                })
              }}
            </template>

            <template v-slot:text>
              {{
                $t(`dialogs.textConfirmDelete`, {
                  selectedEntity: $tc(`models.selected${captializedEntityName}`)
                })
              }}
            </template>
          </ConfirmationDialog>

          <v-btn
            text
            :disabled="!formValid"
            @click="uuid === null ? save() : update()"
          >
            {{ $t("actions.save") }}
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text class="pb-0">
        <component
          :is="serviceRepository.formComponent"
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
          {{ $t("actions.save") }}
        </v-btn>
        <v-btn data-cy="entity-cancel" text @click="closeDialog">
          {{ $t("actions.cancel") }}
        </v-btn>

        <v-spacer></v-spacer>

        <ConfirmationDialog v-if="uuid !== null" @confirm="destroy">
          <template v-slot:activator="{ on }">
            <v-btn
              data-cy="entity-form-delete-button"
              text
              color="error"
              v-on="on"
            >
              {{ $t("actions.delete") }}
            </v-btn>
          </template>

          <template v-slot:title>
            {{
              $t("buttons.deleteEntity", {
                entity: $tc(`models.${entityName}`)
              })
            }}
          </template>

          <template v-slot:text>
            {{
              $t(`dialogs.textConfirmDelete`, {
                selectedEntity: $tc(`models.selected${captializedEntityName}`)
              })
            }}
          </template>
        </ConfirmationDialog>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { capitalizeFirstLetter } from "@/utils";
import { handleApiError } from "@/utils/interceptors";
import { mdiDelete, mdiClose } from "@mdi/js";

import ConfirmationDialog from "@/components/ConfirmationDialog";

import { ServiceFactory } from "@/factories/serviceFactory";

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
    captializedEntityName() {
      return capitalizeFirstLetter(this.entityName);
    },
    serviceRepository() {
      return ServiceFactory.get(this.entityName);
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
      this.serviceRepository.serviceLoader().then(service => {
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
          this.$emit("refresh", { contract: this.toSave.contract });
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
          this.$emit("refresh", { contract: this.toSave.contract });
        })
        .then(() => {
          this.closeDialog();
        })
        .catch(handleApiError);
    }
  }
};
</script>
