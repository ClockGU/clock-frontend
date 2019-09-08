<template>
  <div>
    <v-text-field
      v-model="data"
      v-mask="'##:##'"
      return-masked-value
      :error-messages="errors"
      :label="label"
      outlined
      mask="time"
      append-icon="access_time"
      hint="HH:mm"
      :persistent-hint="true"
      @click:append="clickAppend"
      @blur="setTime"
    ></v-text-field>

    <TheDialog
      v-if="dialog"
      :max-width="400"
      :persistent="false"
      @click:outside="dialog = false"
    >
      <template v-slot:content>
        <v-time-picker
          v-model="data"
          format="24hr"
          full-width
          @click:minute="setTime"
        ></v-time-picker>
      </template>
    </TheDialog>
  </div>
</template>

<script>
import { format } from "date-fns";
import { Shift } from "@/models/ShiftModel";
import TheDialog from "@/components/TheDialog";

export default {
  name: "ShiftFormTimeInput",
  components: {
    TheDialog
  },
  props: {
    value: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    errors: {
      type: Array,
      default: () => []
    },
    label: {
      type: String,
      default: ""
    }
  },
  data: () => ({
    menu: false,
    data: null,
    opposites: {
      start: "end",
      end: "start"
    },
    dialog: false
  }),
  computed: {
    time: {
      get() {
        return format(this.value.date[this.type], "HH:mm");
      },
      set(val) {
        // User deleted all input
        if (val === "") {
          this.data = format(this.value.date[this.type], "HH:mm");
          return;
        }

        // Grab year, month and day from date entry
        const [year, month, day] = format(
          this.value.date[this.type],
          "YYYY-MM-DD"
        ).split("-");
        let [hours, minutes] = val.split(":");

        // Manually reset hours and minutes to valid values
        if (parseInt(hours) > 23) {
          hours = 23;
        }
        if (parseInt(minutes) > 59) {
          minutes = 59;
        }

        const date = new Date(year, month - 1, day, hours, minutes);

        const newValue = { ...this.value };
        newValue.date[this.type] = date;
        const shift = new Shift({ ...newValue });

        this.$emit("input", shift);
        this.data = `${hours}:${minutes}`;
      }
    }
  },
  created() {
    this.data = format(this.value.date[this.type], "HH:mm");
  },
  methods: {
    clickAppend() {
      this.dialog = true;
    },
    setTime() {
      this.time = this.data;
      this.$emit("update");

      if (this.dialog) {
        this.dialog = false;
      }
    }
  }
};
</script>
