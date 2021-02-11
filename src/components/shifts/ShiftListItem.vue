<template>
  <v-list-item @click="editable ? openDialog() : () => {}">
    <v-list-item-content>
      <v-list-item-title>
        {{ item.date.start | formatDay }}
      </v-list-item-title>
      <v-list-item-subtitle class="text--primary">
        {{ item.date.start | formatTime }} -
        {{ item.date.end | formatTime }}
        ({{ item.representationalDuration("hm") }})
      </v-list-item-subtitle>
      <v-list-item-subtitle>
        <v-chip
          data-cy="shift-list-item-type"
          outlined
          small
          class="my-1 mr-1"
          :color="typeColor"
        >
          {{ $t(`shifts.types.${item.type.value}`) }}
        </v-chip>

        <v-chip
          v-for="(tag, i) in item.tags"
          :key="tag"
          :data-cy="'shift-list-item-tag-' + i"
          filled
          small
          class="ma-1"
        >
          {{ tag }}
        </v-chip>

        <v-chip
          v-if="!item.reviewed"
          data-cy="shift-list-item-type"
          outlined
          small
          class="ma-1"
          color="warning"
        >
          {{ $t("dashboard.notYetReviewed") }}
        </v-chip>
      </v-list-item-subtitle>
    </v-list-item-content>

    <FormDialog
      v-if="dialog"
      entity-name="shift"
      :entity="shiftEntity"
      @close="closeDialog"
      @refresh="$emit('refresh')"
    />
  </v-list-item>
</template>

<script>
import { SHIFT_TYPE_COLORS } from "@/utils/colors";

import { localizedFormat } from "@/utils/date";

import FormDialog from "@/components/FormDialog";

export default {
  name: "ShiftListItem",
  components: { FormDialog },
  filters: {
    formatDay(date) {
      return localizedFormat(date, "EEEE',' do MMMM yyyy");
    },
    formatDate(date) {
      return localizedFormat(date, "dd'.'MM'.' HH':'mm");
    },
    formatTime(date) {
      return localizedFormat(date, "HH':'mm");
    }
  },
  props: {
    editable: {
      type: Boolean,
      required: true
    },
    item: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    dialog: false,
    shiftEntity: null
  }),
  computed: {
    typeColor() {
      return SHIFT_TYPE_COLORS[this.item.type.value];
    }
  },
  methods: {
    closeDialog() {
      this.shiftEntity = null;
      this.dialog = false;
    },
    openDialog() {
      this.shiftEntity = this.item;
      this.dialog = true;
    }
  }
};
</script>
