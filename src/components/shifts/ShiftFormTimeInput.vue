<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
  >
    <template #activator="{ props }">
      <!--      <v-tooltip-->
      <!--        :value="errorMessages.length > 0"-->
      <!--        bottom-->
      <!--        :open-on-hover="false"-->
      <!--        color="error"-->
      <!--      >-->
      <!--        <template #activator="{ on: toolOn }">-->
      <v-text-field
        v-model="data"
        :class="error ? 'text' : ''"
        :data-time-value="data"
        return-masked-value
        hide-details
        variant="filled"
        density="compact"
        :error="error"
        mask="time"
        :readonly="smAndDown"
        :prepend-icon="prependIcon ? icons.mdiClockOutline : ''"
        v-bind="props"
        @blur="setTime"
        @focus="$event.target.select()"
      ></v-text-field>
      <!--        </template>-->
      <!--        <span>{{ errorMessages[0] }} </span>-->
      <!--      </v-tooltip>-->
    </template>
    <!--  Time Picker not available yet (29.09.23)  -->
    <!--    <v-time-picker-->
    <!--      v-if="menu && smAndDown"-->
    <!--      v-model="data"-->
    <!--      format="24hr"-->
    <!--      @click:minute="setTime"-->
    <!--    ></v-time-picker>-->
    <p v-if="menu && smAndDown">Imagine Time picker here</p>
  </v-menu>
</template>

<script>
import { localizedFormat } from "@/utils/date";
import { validateTimeInput } from "@/utils/time";

import { mdiClockOutline } from "@mdi/js";
import { useDisplay } from "vuetify";
import { isSameMinute } from "date-fns";

export default {
  name: "ShiftFormTimeInput",
  props: {
    modelValue: {
      type: Date,
      required: true
    },
    error: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ""
    },
    prependIcon: {
      type: Boolean,
      default: false
    },
    errorMessages: {
      type: Array,
      default: () => []
    }
  },
  emits: ["update:modelValue"],
  data() {
    return {
      menu: false,
      data: null,
      opposites: { start: "end", end: "start" },
      icons: {
        mdiClockOutline
      },
      time: this.modelValue
    };
  },
  computed: {
    smAndDown() {
      const { smAndDown } = useDisplay();
      return smAndDown.value;
    }
  },
  watch: {
    modelValue(val) {
      this.time = localizedFormat(val, "HH:mm");
    },
    time(val) {
      if (val === "now" || val === "jetzt") {
        val = localizedFormat(new Date(), "HH:mm");
      }

      let hours, minutes;

      try {
        [hours, minutes] = validateTimeInput(val).split(":");
      } catch {
        this.data = localizedFormat(this.modelValue, "HH:mm");
        return;
      }
      // Grab year, month and day from date entry
      const [year, month, day] = [
        this.modelValue.getFullYear(),
        this.modelValue.getMonth(),
        this.modelValue.getDate()
      ];
      const date = new Date(year, month, day, hours, minutes);
      if (!isSameMinute(date, this.modelValue)) {
        this.$emit("update:modelValue", date);
      }
      this.data = `${hours}:${minutes}`;
    }
  },
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      this.data = localizedFormat(this.modelValue, "HH:mm");
    },
    setTime() {
      this.time = this.data;
      if (this.dialog) {
        this.dialog = false;
      }
    }
  }
};
</script>

<style>
.text::after {
  content: " ";
  position: absolute;
  top: 100%;
  left: 25%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #ff5252 transparent transparent transparent;
}
</style>
