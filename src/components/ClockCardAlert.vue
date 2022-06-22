<template>
  <v-row>
    <v-col cols="12">
      <v-alert :type="type" text dense border="left" class="ma-0">
        <div class="ma-0">
          <div class="font-weight-bold">{{ $t("news.label.warning") }}</div>
          <div v-for="(message, i) in messages" :key="i">
            {{ message }}
          </div>
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

<style scoped>
/*>>> .v-alert__icon {*/
/*  margin: 0;*/
/*  padding-left: 16px;*/
/*}*/
</style>
