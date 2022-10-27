<template>
  <TheDialog
    :fullscreen="$vuetify.breakpoint.smAndDown"
    :max-width="600"
    :persistent="false"
  >
    <template #activator="{ on }">
      <v-btn v-if="!icon" :color="btnColor" v-on="on">
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
      <v-btn v-else :color="btnColor" icon v-on="on">
        <v-icon>{{ create ? icons.mdiPlus : icons.mdiPencil }}</v-icon>
      </v-btn>
    </template>
    <template #content="{ events: { close } }">
      <ShiftForm :existing-shift="shift" :close="close"></ShiftForm>
    </template>
  </TheDialog>
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
    create: {
      type: Boolean,
      default: false
    },
    icon: {
      type: Boolean,
      default: false
    },
    btnColor: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      icons: {
        mdiPencil,
        mdiPlus
      }
    };
  }
};
</script>

<style scoped></style>
