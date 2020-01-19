<template>
  <v-combobox
    v-model="items"
    data-cy="tags"
    :search-input.sync="search"
    :hide-no-data="!search"
    no-data-text="Start typing to search or add a tag."
    hide-selected
    label="Add a tag"
    small-chips
    multiple
    outlined
    clearable
    @input="$emit('input', $event)"
  >
    <template v-slot:no-data>
      <v-list-item three-line>
        <v-list-item-content>
          <v-list-item-title>No results.</v-list-item-title>
          <v-list-item-subtitle>
            Press <kbd>enter</kbd> to create a new tag.
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </template>
    <template v-slot:selection="{ attrs, item, selected }">
      <v-chip
        v-bind="attrs"
        :input-value="selected"
        close
        @click:close="remove(item)"
      >
        <strong>{{ item }}</strong>
      </v-chip>
    </template>
  </v-combobox>
</template>

<script>
export default {
  name: "ShiftFormTags",
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    chips: [],
    items: [],
    search: null
  }),
  created() {
    this.items = this.value;
  },
  methods: {
    remove(item) {
      this.items = this.items.filter(chip => chip !== item);
      this.$emit("input", this.items);
    }
  }
};
</script>
