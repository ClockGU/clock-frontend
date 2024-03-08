<template>
  <v-table>
    <template #default>
      <tbody>
        <tr>
          <td>
            <div style="font-size: 14px; font-weight: 500">Anzeigefarbe</div>
          </td>
          <td>
            <v-menu
              no-click-animation
              :close-on-content-click="false"
              bottom
              offset-x
            >
              <template #activator="{ props }">
                <v-chip
                  :color="color"
                  style="width: 90px"
                  v-bind="props"
                  variant="flat"
                ></v-chip>
              </template>
              <v-color-picker
                v-model="color"
                @update:model-value="$emit('update:modelValue', $event)"
              ></v-color-picker>
            </v-menu>
          </td>
          <td>
            <v-spacer>
              <v-btn variant="text" @click="color = initialColor">
                Reset
              </v-btn>
            </v-spacer>
          </td>
        </tr>
      </tbody>
    </template>
  </v-table>
</template>

<script>
export default {
  name: "ContractColorInput",
  props: {
    modelValue: {
      type: String,
      required: true
    }
  },
  emits: ["update:modelValue"],
  data() {
    return {
      color: this.modelValue,
      initialColor: this.modelValue
    };
  },
  watch: {
    modelValue(val) {
      this.color = val;
    }
  }
};
</script>
<style scoped>
tbody {
  tr:hover {
    background-color: transparent !important;
  }
}
</style>
