<template>
  <v-simple-table>
    <template #default>
      <tbody>
        <tr>
          <td>
            <div style="font-size: 14px; font-weight: 500">Anzeigefarbe</div>
          </td>
          <td>
            <v-menu :close-on-content-click="false" bottom offset-x>
              <template #activator="{ on, attrs }">
                <v-chip
                  v-bind="attrs"
                  :color="color"
                  style="width: 90px"
                  v-on="on"
                ></v-chip>
              </template>
              <v-color-picker
                v-model="color"
                @input="$emit('input', $event)"
              ></v-color-picker>
            </v-menu>
          </td>
          <td>
            <v-spacer>
              <v-btn text @click="color = initialColor"> Reset </v-btn>
            </v-spacer>
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
export default {
  name: "ContractColorInput",
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      color: this.value,
      initialColor: this.value
    };
  },
  watch: {
    value(val) {
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
