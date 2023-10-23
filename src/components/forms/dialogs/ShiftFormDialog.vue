<template>
  <div>
    <TheDialog
      :value="show"
      :fullscreen="$vuetify.breakpoint.smAndDown"
      :max-width="600"
      :persistent="false"
      @close="$emit('close')"
    >
      <template #activator="{ on }">
        <slot name="activator" :on="on"></slot>
        <v-btn
          v-if="!icon && !disableActivator"
          :disabled="disabled"
          :color="btnColor"
          :text="textButton"
          v-on="on"
          @click="opened = true"
        >
          {{ buttonText }}
        </v-btn>
        <div v-if="icon && !disableActivator">
          <v-btn :disabled="disabled" :color="btnColor" icon v-on="on">
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
import TheDialog from "@/components/TheDialog";
import ShiftForm from "@/components/forms/modelForms/shift/ShiftForm";
import { Shift } from "@/models/ShiftModel";
import { mdiExclamation, mdiPencil, mdiPlus } from "@mdi/js";
import ShiftValidationMixin from "@/mixins/ShiftValidationMixin";
import store from "@/store";
import { isBefore } from "date-fns";
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
      opened: true
    };
  },
  computed: {
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
    },
    date() {
      if (this.newShift.contract === "") {
        let date = store.getters["selectedContract/selectedContract"].startDate;
        date.setHours(10, 0, 0);
        if (isBefore(this.initialDate, date)) {
          return date;
        }
      }
      return this.initialDate;
    }
  },
  watch: {
    value(val) {
      this.show = val;
    }
  }
};
</script>

<style scoped></style>
