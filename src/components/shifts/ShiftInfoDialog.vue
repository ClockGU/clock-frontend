<template>
  <v-dialog v-model="dialog" width="500">
    <template #activator="{ on, attrs }">
      <slot name="activator" :on="on" :attrs="attrs"></slot>
    </template>

    <v-card>
      <v-card v-if="item.tags.length > 0" class="mx-2" flat>
        <v-card-title>Tags</v-card-title>
        <v-card-text>
          <v-chip v-for="tag in item.tags" :key="tag" small class="mr-2">
            {{ tag }}
          </v-chip>
        </v-card-text>
      </v-card>
      <v-card v-if="item.note" class="mx-2" flat>
        <v-card-title>
          {{ $t("shifts.note.note") }}
        </v-card-title>
        <v-card-text>
          {{ item.note }}
        </v-card-text>
      </v-card>
      <v-card-actions class="justify-center">
        <v-btn variant="text" color="primary" @click="dialog = false">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
:
<script>
export default {
  name: "ShiftInfoDialog",
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    dialog: false
  })
};
</script>
