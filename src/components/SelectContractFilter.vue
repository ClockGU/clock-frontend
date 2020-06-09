<template>
  <v-select
    :value="selectedContract"
    :items="contracts"
    :prepend-icon="icons.mdiFileDocumentEditOutline"
    label="Selected contract"
    hint="Change the contract to see different data"
    item-text="name"
    item-value="uuid"
    persistent-hint
    solo
    return-object
    @input="changeContract"
  ></v-select>
</template>

<script>
import { mdiRecord } from "@mdi/js";

export default {
  name: "SelectContractFilter",
  props: {
    contracts: {
      type: Array,
      required: true
    },
    selectedContract: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    icons: { mdiRecord }
  }),
  methods: {
    changeContract({ uuid }) {
      this.$router.push({
        ...this.$route.name,
        params: { ...this.$route.name.params, contract: uuid }
      });
    }
  }
};
</script>
