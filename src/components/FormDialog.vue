<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$vuetify.breakpoint.smAndDown"
    max-width="600"
    no-click-animation
    retain-focus
    @click:outside="closeDialog"
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
            <template #activator="{ on }">
              <v-btn v-if="uuid !== null" icon v-on="on">
                <v-icon>{{ icons.mdiDelete }}</v-icon>
              </v-btn>
            </template>

            <template #title>
              {{
                $t("buttons.deleteEntity", {
                  entity: $tc(`models.${entityName}`)
                })
              }}
            </template>

            <template #text>
              {{
                $t(`dialogs.textConfirmDelete`, {
                  selectedEntity: $tc(`models.selected${captializedEntityName}`)
                })
              }}
            </template>
          </ConfirmationDialog>

          <v-btn
            text
            color="primary"
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
          <template #activator="{ on }">
            <v-btn
              data-cy="entity-form-delete-button"
              text
              color="error"
              v-on="on"
            >
              {{ $t("actions.delete") }}
            </v-btn>
          </template>

          <template #title>
            {{
              $t("buttons.deleteEntity", {
                entity: $tc(`models.${entityName}`)
              })
            }}
          </template>

          <template #text>
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
import { log } from "@/utils/log";
import { addMinutes, isFuture } from "date-fns";

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
    service: null,
    splitData: { splitDuration: 0, breaktime: 0 },
    splitToSave: null
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

    const close = (e) => {
      const ESC = 27;
      if (e.keyCode !== ESC) return;
      this.closeDialog();
    };
    // Close the modal when the
    // user presses the ESC key.
    document.addEventListener("keyup", close);
    this.$on("hook:destroyed", () => {
      document.removeEventListener("keyup", close);
    });
  },
  methods: {
    loadService() {
      this.serviceRepository.serviceLoader().then((service) => {
        this.service = service["default"];
      });
    },
    splitEntity() {
      if (this.splitData.splitDuration !== 0 && this.entityName === "shift") {
        let splitShift = this.toSave.clone();
        splitShift.date.start = addMinutes(
          splitShift.date.start,
          this.splitData.breaktime + this.splitData.splitDuration
        );
        splitShift.reviewed = !isFuture(splitShift.date.start);
        this.toSave.date.end = addMinutes(
          this.toSave.date.start,
          this.splitData.splitDuration
        );
        this.splitToSave = splitShift;
      }
    },
    updateData(event) {
      if (this.entityName === "shift" && event.scheduledShifts !== undefined) {
        this.toSave = [event[this.entityName], ...event.scheduledShifts];
      } else {
        this.toSave = event[this.entityName];
      }
      if (this.entityName === "shift" && event.splitData !== undefined) {
        this.splitData = event.splitData;
      }

      this.formValid = event.valid;
    },
    closeDialog() {
      this.$emit("close");
    },
    destroy() {
      this.service
        .delete(this.toSave.uuid)
        .then(() => {
          this.$emit("refresh", { contract: this.toSave.contract });
        })
        .catch(handleApiError)
        .finally(() => {
          this.closeDialog();
        });
    },
    async update() {
      this.splitEntity();
      let entityToSave = this.toSave;
      const isAnArray = Array.isArray(entityToSave);
      if (!isAnArray) {
        entityToSave = [this.toSave];
      }

      const promises = [];
      try {
        for (const i in entityToSave) {
          const shift = entityToSave[i];
          const method = shift.uuid !== null ? "update" : "create";
          promises.push(this.service[method](shift.toPayload(), shift.uuid));
        }

        await Promise.all(promises);

        if (this.splitToSave !== null) {
          await this.service.create(this.splitToSave.toPayload());
        }

        this.$emit("refresh", { contract: entityToSave[0].contract });
        this.closeDialog();
      } catch (error) {
        // TODO: Set error state for component & allow user to reload page
        // We usually should end up here, if we are already logging out.
        // But a proper error state could mitigate further issues.
        log(error);
      }
    },
    async save() {
      this.splitEntity();
      let entityToSave = this.toSave;
      const isAnArray = Array.isArray(entityToSave);
      if (!isAnArray) {
        entityToSave = [this.toSave];
      }
      if (this.splitToSave !== null) {
        entityToSave.push(this.splitToSave);
      }
      const promises = [];

      try {
        for (const shift of entityToSave) {
          promises.push(this.service.create(shift.toPayload(), shift.uuid));
        }

        await Promise.all(promises);

        this.$emit("refresh", { contract: entityToSave[0].contract });
        this.closeDialog();
      } catch (error) {
        // TODO: Set error state for component & allow user to reload page
        // We usually should end up here, if we are already logging out.
        // But a proper error state could mitigate further issues.
        log(error);
      }
    }
  }
};
</script>
