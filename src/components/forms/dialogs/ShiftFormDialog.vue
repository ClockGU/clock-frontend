<template>
  <div>
    <TheDialog
      v-model="show"
      :fullscreen="smAndDown"
      :max-width="600"
      :persistent="false"
      @close="closeFormDialog"
    >
      <template #activator="props">
        <slot name="activator" v-bind="props"></slot>
        <v-btn
          v-if="!icon && !disableActivator"
          :disabled="disabled"
          :color="btnColor"
          :flat="flatButton"
          v-bind="props['props']"
        >
          {{ buttonText }}
        </v-btn>
        <div v-if="icon && !disableActivator">
          <v-btn
            :disabled="disabled"
            variant="flat"
            :color="btnColor"
            :flat="flatButton"
            :icon="create ? icons.mdiPlus : icons.mdiPencil"
            v-bind="props['props']"
          />
          <v-icon
            v-if="alertMessages.length > 0"
            color="warning"
            style="transform: translate(-65%, -50%)"
            >{{ icons.mdiExclamation }}
          </v-icon>
        </div>
      </template>
      <template #content="{ events: { close } }">
        <ShiftForm
          v-model="newShift"
          :initial-date="date"
          :close="close"
          :show-errors="show"
          :initial-contract="initialContract"
          @save="$emit('save')"
          @delete="$emit('delete')"
          @update="$emit('update')"
          @close="closeFormDialog"
        ></ShiftForm>
      </template>
    </TheDialog>
  </div>
</template>

<script>
import TheDialog from "@/components/TheDialog.vue";
import ShiftForm from "@/components/forms/modelForms/shift/ShiftForm.vue";
import { Shift } from "@/models/ShiftModel";
import { mdiExclamation, mdiPencil, mdiPlus } from "@mdi/js";
import ShiftValidationMixin from "@/mixins/ShiftValidationMixin";
// eslint-disable-next-line no-unused-vars
import store from "@/store";
import { isBefore } from "date-fns";
import { useDisplay } from "vuetify";

export default {
  name: "ShiftFormDialog",
  components: { ShiftForm, TheDialog },
  mixins: [ShiftValidationMixin],
  props: {
    shift: {
      type: Shift,
      required: false,
      default: undefined
    },
    initialDate: {
      type: Date,
      required: false,
      default: () => new Date()
    },
    icon: {
      type: Boolean,
      default: false
    },
    btnColor: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    },
    disableActivator: {
      type: Boolean,
      default: false
    },
    textButton: {
      type: Boolean,
      default: false
    },
    flatButton: {
      type: Boolean,
      default: false
    },
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: ["close", "save", "update", "delete", "update:model-value"],
  data() {
    return {
      icons: {
        mdiPencil,
        mdiPlus,
        mdiExclamation
      },
      show: this.modelValue,
      newShift: this.shift,
      initialContract: ""
    };
  },
  computed: {
    smAndDown() {
      const { smAndDown } = useDisplay();
      return smAndDown.value;
    },
    create() {
      return this.shift === undefined;
    },
    buttonText() {
      if (!this.textButton) {
        return this.create
          ? this.$t("buttons.newEntity", {
              entity: this.$tc("models.shift")
            })
          : this.$t("buttons.updateEntity", {
              entity: this.$tc("models.shift")
            });
      }
      return this.create ? this.$t("buttons.add") : this.$t("actions.edit");
    },
    date() {
      if (this.create) {
        let date;
        try {
          date = this.$store.getters["selectedContract/selectedContract"]
            .startDate;
          date.setHours(10, 0, 0);
        } catch {
          return this.initialDate;
        }
        if (isBefore(this.initialDate, date)) {
          return date;
        }
      }
      return this.initialDate;
    }
  },
  watch: {
    modelValue(val) {
      this.show = val;
    },
    show(val) {
      if (val) {
        this.initializeNewShift();
      }
    }
  },
  methods: {
    initializeNewShift() {
      let date = this.initialDate;
      if (this.create) {
        const contractStartDate = this.$store.getters[
          "selectedContract/selectedContract"
        ].startDate;

        if (isBefore(this.initialDate, contractStartDate)) {
          date = contractStartDate;
        }
      }
      let started = new Date(date);
      started.setHours(10, 0, 0, 0);
      let stopped = new Date(date);
      stopped.setHours(10, 30, 0, 0);
      this.newShift = !this.create
        ? this.shift.clone()
        : new Shift({ started: started, stopped: stopped });
      this.initialContract = this.newShift.contract;
    },
    closeFormDialog() {
      this.$emit("close");
      this.$emit("update:model-value", false);
    }
  }
};
</script>

<style scoped></style>
