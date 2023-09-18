<template>
  <v-row>
    <v-col cols="12" class="ma-0">
      <v-alert :type="type" text density="compact" border="start" class="ma-0">
        <div class="ma-0">
          <div class="font-weight-bold">{{ $t("news.label.warning") }}</div>
          <ul>
            <li v-for="(message, i) in messages" :key="i">
              {{ message }}
            </li>
          </ul>
        </div>
      </v-alert>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "ClockCardAlert",
  props: {
    type: {
      type: String,
      default: "warning",
      validator(value) {
        return ["warning", "error"].includes(value);
      }
    },
    messages: {
      type: Array,
      required: true
    }
  },
  data() {
    return {};
  }
};
</script>
