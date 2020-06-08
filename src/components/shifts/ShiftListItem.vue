<template>
  <v-list-item :disabled="item.exported || !editable">
    <template v-slot:default="{ active }">
      <v-list-item-action v-if="editable">
        <v-checkbox
          :disabled="!editable || item.exported"
          :value="active"
        ></v-checkbox>
      </v-list-item-action>

      <v-list-item-content>
        <v-list-item-title>
          {{ item.date.start | formatDay }}
        </v-list-item-title>
        <v-list-item-subtitle :class="item.exported ? '' : 'text--primary'">
          {{ item.date.start | formatTime }} -
          {{ item.date.end | formatTime }}
          ({{ item.representationalDuration("hm") }})
        </v-list-item-subtitle>
        <v-list-item-subtitle>
          <v-chip
            data-cy="shift-list-item-type"
            outlined
            small
            class="my-2"
            :color="typeColor"
          >
            {{ item.type.text }}
          </v-chip>

          <span v-if="item.tags.length > 0">&nbsp;&mdash;&nbsp;</span>

          <v-chip
            v-for="(tag, i) in item.tags"
            :key="tag"
            :data-cy="'shift-list-item-tag-' + i"
            outlined
            small
            class="my-2"
          >
            {{ tag }}
          </v-chip>
        </v-list-item-subtitle>
      </v-list-item-content>
    </template>
  </v-list-item>
</template>

<script>
import { SHIFT_TYPE_COLORS } from "@/utils/colors";

import { format } from "date-fns";

export default {
  name: "ShiftListItem",
  filters: {
    formatDay(date) {
      return format(date, "EEEE',' do");
    },
    formatDate(date) {
      return format(date, "dd'.'MM'.' HH':'mm");
    },
    formatTime(date) {
      return format(date, "HH':'mm");
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
  computed: {
    typeColor() {
      return SHIFT_TYPE_COLORS[this.item.type.value];
    }
  },
  methods: {
    click() {
      if (this.editable) return;

      this.$router.push({
        name: "editShift",
        params: { uuid: this.item.uuid }
      });
    }
  }
};
</script>
