<template>
  <v-combobox
    :value="value"
    :items="items"
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
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            No results matching "<strong>{{ search }}</strong
            >". Press <kbd>enter</kbd> to create a new tag.
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
    <template v-slot:selection="data">
      <v-chip
        :input-value="data.selected"
        close
        @click:close="remove(data.item)"
      >
        <strong>{{ data.item }}</strong>
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
  watch: {
    value(val, prev) {
      if (val.length === prev.length) return;

      this.chips = val.map(v => {
        if (typeof v === "string") {
          this.items.push(v);
        }

        return v;
      });
    }
  },
  methods: {
    remove(item) {
      this.items = this.items.filter(chip => chip !== item);
      this.$emit("input", this.items);
    }
  }
};
</script>
