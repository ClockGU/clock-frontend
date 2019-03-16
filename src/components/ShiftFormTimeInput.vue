<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    :return-value.sync="time"
    lazy
    transition="scale-transition"
    offset-y
    full-width
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-model="time"
        v-on="on"
        readonly
        max-width="100px"
      ></v-text-field>
    </template>
    <v-time-picker
      no-title
      v-model="time"
      format="24hr"
      @click:minute="$refs.menu.save(time)"
    ></v-time-picker>
  </v-menu>
</template>

<script>
export default {
  name: "ShiftFormTimeInput",
  data: () => ({
    menu: false,
    time: null
  }),
  props: {
    shift: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  created() {
    this.time = this.type === "_start" ? "10:00" : "10:30";
  },
  watch: {
    time: function(value) {
      const [hours, minutes] = value.split(":");
      this.shift[this.type].setHours(hours, minutes);
    }
  }
};
</script>
