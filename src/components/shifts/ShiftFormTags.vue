<template>
  <label for="tags" class="ml-10">{{$t('label.shiftFormTags')}}</label>
  <v-combobox
    id="tags"
    v-model="model"
    v-model:search="search"
    data-cy="tags"
    :items="usedTags"
    :hide-no-data="!search"
    hide-selected
    :label="$t('shifts.tags.label')"
    chips
    multiple
    variant="filled"
    clearable
    :prepend-icon="icons.mdiTagOutline"
    @update:model-value="$emit('update:modelValue', $event)"
    @change="search = null"
  >
    <template #no-data>
      <v-list-item>
        <v-list-item-title>
          <i18n-t keypath="shifts.tags.createHint" scope="global" tag="span">
            <template #search>
              <strong>{{ search }}</strong>
            </template>
            <template #enter>
              <kbd>{{ $t("app.enterKey") }}</kbd>
            </template>
          </i18n-t>
        </v-list-item-title>
      </v-list-item>
    </template>
    <template #selection="{ attrs, item, selected }">
      <v-chip
        class="mt-2 ml-0"
        v-bind="attrs"
        :model-value="selected"
        closable
        @click:close="remove(item)"
      >
        <strong>{{ item }}</strong>
      </v-chip>
    </template>
  </v-combobox>
</template>

<script>
import { mdiTagOutline } from "@mdi/js";

export default {
  name: "ShiftFormTags",
  props: {
    modelValue: {
      type: Array,
      default: () => []
    }
  },
  emits: ["update:modelValue"],
  data: () => ({
    icons: { mdiTagOutline },
    model: [],
    search: null
  }),
  computed: {
    usedTags() {
      return this.$store.getters["contentData/allShifts"].reduce((a, b) => {
        return a.concat(b.tags);
      }, []);
    }
  },
  created() {
    this.model = this.modelValue;
  },
  methods: {
    remove(item) {
      this.model = this.model.filter((chip) => chip !== item);
      this.$emit("update:modelValue", this.model);
    }
  }
};
</script>
