<template>
  <v-list-item @click="click">
    <template v-slot:default="{ active }">
      <v-list-item-action v-if="editable">
        <v-checkbox :disabled="!editable" :value="active"></v-checkbox>
      </v-list-item-action>

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
            v-for="tag in item.tags"
            :key="tag"
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
