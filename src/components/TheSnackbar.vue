<template>
  <div>
    <v-snackbar
      v-for="(snack, i) in snacks"
      :key="snack.uuid"
      v-model="snack.show"
      data-cy="snackbar"
      location="top right"
      multi-line
      :color="snack.color"
      :timeout="snack.timeout"
      :style="{ 'margin-top': i * 70 + 'px' }"
    >
      {{ snack.message }}
      <template #actions>
        <component
          :is="snack.component"
          v-bind="snack.componentProps"
        ></component>
        <v-btn variant="text" @click="removeSnack(snack.uuid)">
          {{ $t("actions.close") }}
        </v-btn>
      </template>
      <v-progress-linear
        reverse
        color="white"
        :model-value="(timePassed[snack.uuid] / snack.timeout) * 100"
      ></v-progress-linear>
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useStore } from "vuex";

const store = useStore();

// tracks time passed for progress bar
const timePassed = reactive({});
const intervals = reactive({});

const snacks = ref(store.getters["snackbar/snacks"]);

// Clears interval, removes local state, and dispatches Vuex action to remove snack.
const removeSnack = (uuid) => {
  delete timePassed[uuid];
  clearInterval(intervals[uuid]);
  delete intervals[uuid];
  store.dispatch("snackbar/removeSnack", uuid);
};

// Sets an interval to increment timePassed for progress bar animation.
const setupInterval = (snack) => {
  if (timePassed[snack.uuid] === undefined) {
    timePassed[snack.uuid] = 0;
  }

  intervals[snack.uuid] = setInterval(() => {
    timePassed[snack.uuid] = timePassed[snack.uuid] + 500;
  }, 500);
};

// Sets a setTimeout to automatically remove the snack after its duration.
const setupTimeout = (snack) => {
  setTimeout(() => {
    removeSnack(snack.uuid);
  }, snack.timeout);
};

onMounted(() => {
  store.watch(
    (state, getters) => getters["snackbar/snacks"],
    (newSnacks) => {
      snacks.value = newSnacks;
      // Loop new snacks to initialize timers/intervals only if they don't exist.
      newSnacks.forEach((snack) => {
        if (intervals[snack.uuid] === undefined) {
          setupInterval(snack);
          setupTimeout(snack);
        }
      });
    },
    {
      deep: true,
      immediate: true
    }
  );
});
</script>
