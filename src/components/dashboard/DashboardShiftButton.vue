<template>
  <v-card>
    <v-hover>
      <template #default="{ hover }">
        <div @click="toggleTouchOverlay(hover)">
          <v-card-title>
            {{ $t("dashboard.newShift.title") }}
          </v-card-title>

          <v-card-text>
            <v-btn :disabled="disabled" color="primary" @click="dialog = true">
              {{ $t("buttons.newEntity", { entity: $tc("models.shift") }) }}
            </v-btn>
          </v-card-text>

          <v-fade-transition>
            <v-overlay
              v-if="disabled && (hover || touchOverlay)"
              absolute
              color="primary"
              style="align-items: start"
            >
              <p style="margin-top: 11%" class="text-center">
                {{ $t("dashboard.disabled.createShiftsHere") }}
              </p>
            </v-overlay>
          </v-fade-transition>
        </div>
      </template>
    </v-hover>
    <FormDialog
      v-if="dialog"
      entity-name="shift"
      :entity="null"
      @close="dialog = false"
      @refresh="refresh"
    />
  </v-card>
</template>

<script>
import FormDialog from "@/components/FormDialog";
import { getNextContractParams } from "@/utils";

export default {
  name: "DashboardShiftButton",
  components: { FormDialog },
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    dialog: false,
    touchOverlay: false
  }),
  methods: {
    async refresh({ contract }) {
      if (this.$route.params.contract !== contract) {
        await this.$router.replace(
          getNextContractParams(this.$route, contract)
        );
      }
      this.$emit("refresh");
    },
    toggleTouchOverlay(hover) {
      this.touchOverlay = hover ? false : !this.touchOverlay;
    }
  }
};
</script>
