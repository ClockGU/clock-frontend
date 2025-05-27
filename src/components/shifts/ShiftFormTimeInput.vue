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
        v-model="textFieldTime"
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
        @blur="setTimeFromTextField"
        @keydown.enter="$event.target.blur()"
        @focus="$event.target.select()"
      ></v-text-field>
      <!--        </template>-->
      <!--        <span>{{ errorMessages[0] }} </span>-->
      <!--      </v-tooltip>-->
    </template>
    <VTimePicker
      v-if="menu && smAndDown"
      v-model="time"
      format="24hr"
      @update:minute="menu = false"
    ></VTimePicker>
  </v-menu>
</template>

<script>
import { localizedFormat } from "@/utils/date";
import { validateTimeInput } from "@/utils/time";
import { VTimePicker } from "vuetify/labs/VTimePicker";
import { mdiClockOutline } from "@mdi/js";
import { isSameMinute } from "date-fns";

export default {
  name: "ShiftFormTimeInput",
  components: { VTimePicker },
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
      time: null,
      textFieldTime: null
    };
  },
  computed: {
    smAndDown() {
      return this.$vuetify.display.smAndDown;
    }
  },
  watch: {
    modelValue(val) {
      this.time = localizedFormat(val, "HH:mm");
      this.textFieldTime = this.time;
    },
    time(val) {
      let [hours, minutes] = val.split(":");
      // Grab year, month and day from date entry
      const [year, month, day] = [
        this.modelValue.getFullYear(),
        this.modelValue.getMonth(),
        this.modelValue.getDate()
      ];
      const date = new Date(
        year,
        month,
        day,
        parseInt(hours),
        parseInt(minutes)
      );
      if (!isSameMinute(date, this.modelValue)) {
        this.$emit("update:modelValue", date);
      }
    }
  },
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      this.time = localizedFormat(this.modelValue, "HH:mm");
      this.textFieldTime = this.time;
    },
    setTimeFromTextField() {
      let time;
      try {
        time = validateTimeInput(this.textFieldTime);
        time.split(":");
      } catch {
        this.textFieldTime = this.time;
        return;
      }
      this.time = time;
      this.textFieldTime = time;
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
