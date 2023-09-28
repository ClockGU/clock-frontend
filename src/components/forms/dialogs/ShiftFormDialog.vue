<template>
  <div>
    <TheDialog
      :value="show"
      :fullscreen="smAndDown"
      :max-width="600"
      :persistent="false"
      @close="$emit('close')"
    >
      <template #activator="props">
        <slot name="activator" v-bind="props"></slot>
        <v-btn
          v-if="!icon && !disableActivator"
          :disabled="disabled"
          :color="btnColor"
          :variant="textButton && 'text'"
          v-bind="props"
          @click="opened = true"
        >
          {{ buttonText }}
        </v-btn>
        <div v-if="icon && !disableActivator">
          <v-btn :disabled="disabled" :color="btnColor" icon v-bind="props">
            <v-icon>{{ create ? icons.mdiPlus : icons.mdiPencil }} </v-icon>
          </v-btn>
          <v-icon
            v-if="alertMessages.length > 0"
            color="warning"
            style="transform: translate(-65%, -50%)"
            >{{ icons.mdiExclamation }}</v-icon
          >
        </div>
      </template>
      <template #content="{ events: { close } }">
        <ShiftForm
          :existing-shift="shift"
          :initial-date="date"
          :close="close"
          :show-errors="opened"
          @save="$emit('save')"
          @delete="$emit('delete')"
          @update="$emit('update')"
          @close="opened = false"
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
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      icons: {
        mdiPencil,
        mdiPlus,
        mdiExclamation
      },
      show: this.value,
      opened: true,
      date: this.initialDate
    };
  },
  computed: {
    smAndDown() {
      const { smAndDown } = useDisplay();
      return smAndDown;
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
    newShift() {
      return this.create ? new Shift() : this.shift;
    }
  },
  watch: {
    value(val) {
      this.show = val;
    },
    initialDate(val) {
      this.date = val;
    }
  }
};
</script>

<style scoped></style>
