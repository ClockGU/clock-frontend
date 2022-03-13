<template>
  <v-card>
    <v-card-title>
      {{ $t("dashboard.newShift.title") }}
    </v-card-title>

    <v-card-text>
      <v-btn color="primary" @click="dialog = true">
        {{ $t("buttons.newEntity", { entity: $tc("models.shift") }) }}
      </v-btn>
    </v-card-text>

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
  data: () => ({
    dialog: false
  }),
  methods: {
    async refresh({ contract }) {
      if (this.$route.params.contract !== contract) {
        await this.$router.replace(
          getNextContractParams(this.$route, contract)
        );
      }
      this.$emit("refresh");
    }
  }
};
</script>
