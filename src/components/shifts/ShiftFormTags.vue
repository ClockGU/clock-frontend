<template>
  <v-combobox
    v-model="model"
    data-cy="tags"
    :items="usedTags"
    :search-input.sync="search"
    :hide-no-data="!search"
    hide-selected
    :label="$t('shifts.tags.label')"
    chips
    multiple
    filled
    clearable
    :prepend-icon="icons.mdiTagOutline"
    @input="$emit('input', $event)"
    @change="search = null"
  >
    <template #no-data>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            <i18n path="shifts.tags.createHint" tag="span">
              <template #search>
                <strong>{{ search }}</strong>
              </template>
              <template #enter>
                <kbd>{{ $t("app.enterKey") }}</kbd>
              </template>
            </i18n>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
    <template #selection="{ attrs, item, selected }">
      <v-chip
        class="mt-2 ml-0"
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

import { mdiTagOutline } from "@mdi/js";

export default {
  name: "ShiftFormTags",
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    icons: { mdiTagOutline },
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
      this.model = this.model.filter((chip) => chip !== item);
      this.$emit("input", this.model);
    }
  }
};
</script>
