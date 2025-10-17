<template>
  <v-card :max-height="800">
    <CardToolbar
      :title="title"
      close-action
      @close="$emit('close')"
    ></CardToolbar>
    <v-card-text style="max-height: 800px">
      <div style="max-height: 700px; overflow-y: scroll">
        <v-list dense>
          <template
            v-for="(overlapGroup, groupIndex) in allOverlappingShifts"
            :key="`header-${groupIndex}`"
          >
            <v-list-item-title class="text-h6 pt-4 pb-2 red--text text-center">
              {{ $t('dashboard.overlaps.setNumber', { n: groupIndex + 1 }) }}
            </v-list-item-title>

            <ShiftListItem
              v-for="(shiftItem, shiftIndex) in overlapGroup"
              :key="shiftItem.id + '-' + groupIndex + '-' + shiftIndex"
              :shift="shiftItem"
              :error="true"
              :editable="true"
              class="mb-2"
            >
              <template #extraSubtitle>
                <v-list-item-subtitle class="caption">
                  {{ $t('models.contract')+': ' + getContractName(shiftItem.contract) }}
                </v-list-item-subtitle>
              </template>

              <template #actions>
                <ShiftActionsDialogEdit :shift="shiftItem" />

                <ShiftBulkActionsDialogDelete
                  :count="1"
                  @destroy="handleShiftDelete(shiftItem)"
                >
                  <template #activator="{ props }">
                    <v-btn icon variant="text" v-bind="props" @click.stop>
                      <v-icon>{{ icons.mdiDelete }}</v-icon>
                    </v-btn>
                  </template>
                </ShiftBulkActionsDialogDelete>
              </template>
            </ShiftListItem>
            <v-divider></v-divider>
          </template>
        </v-list>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { localizedFormat } from "@/utils/date";
import { getOverlappingShifts } from "@/utils/shift";
import { mdiClose, mdiDelete } from "@mdi/js";

import { mapState } from "vuex";
import CardToolbar from "@/components/cards/CardToolbar.vue";
import ShiftListItem from "@/components/shifts/ShiftListItem.vue";
import ShiftBulkActionsDialogDelete from "@/components/shifts/ShiftBulkActionsDialogDelete.vue";
import ShiftActionsDialogEdit from "@/components/shifts/ShiftActionsDialogEdit.vue";

export default {
  name: "OverlappingShiftsList",
  components: {
    CardToolbar,
    ShiftListItem,
    ShiftBulkActionsDialogDelete,
    ShiftActionsDialogEdit
  },
  props: {
    month: {
      type: Date,
      required: true
    },
    shifts: {
      type: Array,
      required: true
    }
  },
  emits: ["close"],
  data: () => ({
    icons: {
      mdiClose,
      mdiDelete
    }
  }),
  computed: {
    ...mapState({
      locale: "locale"
    }),
    allOverlappingShifts() {
      return getOverlappingShifts(this.shifts).sort((a, b) => {
        return a[0].started - b[0].started;
      });
    },
    title() {
      return (
        this.$t("calendar.overlap.resolving") +
        localizedFormat(this.month, "MMMM yyyy")
      );
    }
  },
  methods: {
    getContractName(contractId) {
      const contract = this.$store.getters["contentData/contractById"](
        contractId
      );
      return contract ? contract.name : this.$t("contracts.unknownContract");
    },
    async handleShiftDelete(shift) {
      try {
        await this.$store.dispatch("contentData/deleteShift", shift);
      } catch (error) {
        console.error("Error deleting shift:", error);
      }
    }
  }
};
</script>

<style>
.scroll {
  overflow-y: scroll;
}
</style>
