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
        <v-btn
          v-if="!icon && !disableActivator"
          :disabled="disabled"
          :color="btnColor"
          v-on="on"
        >
          {{
            create
              ? $t("buttons.newEntity", {
                  entity: $tc("models.shift")
                })
              : $t("buttons.updateEntity", {
                  entity: $tc("models.shift")
                })
          }}
        </v-btn>
        <v-btn
          v-if="icon && !disableActivator"
          :disabled="disabled"
          :color="btnColor"
          icon
          v-on="on"
        >
          <v-icon>{{ create ? icons.mdiPlus : icons.mdiPencil }}</v-icon>
        </v-btn>
      </template>
      <template #content="{ events: { close } }">
        <ShiftForm :existing-shift="shift" :close="close"></ShiftForm>
      </template>
    </TheDialog>
  </div>
</template>

<script>
import TheDialog from "@/components/TheDialog";
import ShiftForm from "@/components/forms/modelFroms/shift/ShiftForm";
import { Shift } from "@/models/ShiftModel";
import { mdiPencil, mdiPlus } from "@mdi/js";
export default {
  name: "ShiftFormDialog",
  components: { ShiftForm, TheDialog },
  props: {
    shift: {
      type: Shift,
      required: false,
      default: undefined
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
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      icons: {
        mdiPencil,
        mdiPlus
      },
      show: this.value
    };
  },
  computed: {
    create() {
      return this.shift === undefined;
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
