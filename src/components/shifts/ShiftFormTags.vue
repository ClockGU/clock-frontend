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
    clearable
    @input="$emit('input', $event)"
  >
    <template v-slot:no-data>
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-title>
            No results matching "<strong>{{ search }}</strong
            >". Press <kbd>enter</kbd> to create a new tag.
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </template>
    <template v-slot:selection="data">
      <v-chip :selected="data.selected" close @input="remove(data.item)">
        <strong>{{ data.item }}</strong>
      </v-chip>
    </template>
  </v-combobox>
</template>

<script>
export default {
  name: "ShiftFormInput",
  props: {
    value: {
      type: Array
    }
  },
  data: () => ({
    chips: [],
    items: [],
    search: null
  }),
  methods: {
    remove(item) {
      this.chips.splice(this.chips.indexOf(item), 1);
      this.chips = [...this.chips];
    }
  },
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
  }
};
</script>
