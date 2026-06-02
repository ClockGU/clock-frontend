<template>
  <v-row>
    <v-col cols="12" class="ma-0">
      <v-alert
        :type="type"
        text
        density="compact"
        border="start"
        class="ma-0"
        style="border-radius: 0 0 4px 4px"
      >
        <div class="ma-0">
          <div class="font-weight-bold">{{ $t("news.label.warning") }}</div>
          <ul class="pl-5">
            <li v-for="(message, i) in displayMessages" :key="i">
              {{ message }}
            </li>
          </ul>
        </div>
      </v-alert>
      <div class="margin-l-t-r-2">
        {{ $t("shifts.hints.faqText") }}
        <br />
        <router-link to="/faq">{{
          $t("shifts.hints.faqLinkText")
        }}</router-link>
      </div>
      <div class="margin-l-t-r-2 mb-2">
        {{ $t("shifts.hints.ombudsText") }}
        <OmbudsMenu disable-activator :bottom-position="false" offset-y bottom>
          <template #activator="{ props }">
            <button
              aria-label="Open OmbudpersonMenu"
              class="link-appearance"
              v-bind="props"
            >
              {{ $t("shifts.hints.ombudsLinkText") }}
            </button>
          </template>
        </OmbudsMenu>
      </div>
    </v-col>
  </v-row>
</template>

<script setup>
import OmbudsMenu from "@/components/ombud/OmbudsMenu.vue";
import { computed } from "vue";

const props = defineProps({
  type: {
    type: String,
    default: "warning",
    validator(value) {
      return ["warning", "error"].includes(value);
    }
  },
  messages: { type: Array, default: () => [] }
});
const displayMessages = computed(() => props.messages);
</script>

<style scoped>
.margin-l-t-r-2 {
  margin-top: 8px;
  margin-right: 8px;
  margin-left: 8px;
}

.link-appearance {
  color: #0000eeff;
  text-decoration: underline;
  cursor: pointer;
}
</style>
