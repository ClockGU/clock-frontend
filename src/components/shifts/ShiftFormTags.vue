<template>
  <v-combobox
    v-model="model"
    data-cy="tags"
    :items="usedTags"
    :search-input.sync="search"
    :hide-no-data="!search"
    no-data-text="Start typing to search or add a tag."
    hide-selected
    label="Add a tag"
    small-chips
    multiple
    filled
    clearable
    @input="$emit('input', $event)"
    @change="search = null"
  >
    <template v-slot:no-data>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            No results matching "<strong>{{ search }}</strong
            >". Press <kbd>enter</kbd> to create a new one
          </v-list-item-title>
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
import { mapGetters } from "vuex";

export default {
  name: "ShiftFormTags",
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    model: [],
    search: null
  }),
  computed: {
    ...mapGetters({
      usedTags: "shift/usedTags"
    })
  },
  created() {
    this.model = this.value;
  },
  methods: {
    remove(item) {
      this.model = this.model.filter(chip => chip !== item);
      this.$emit("input", this.model);
    }
  }
};
</script>
