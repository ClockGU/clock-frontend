<script setup>
import { useStore } from "vuex";
import svg from "@/assets/clock_full.svg";
import darkSvg from "@/assets/clock_full_darkmode.svg";

import LogoutDialog from "@/components/LogoutDialog.vue";
import { useFocusTrap } from "@vueuse/integrations/useFocusTrap";
import {
  mdiAccountCog,
  mdiCalendar,
  mdiHome,
  mdiFileDocument,
  mdiLock,
  mdiFormatListNumbered,
  mdiFileChart,
  mdiHelp,
  mdiLogout
} from "@mdi/js";
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  useTemplateRef,
  nextTick
} from "vue";
import { useTheme } from "vuetify";
import { useI18n } from "vue-i18n";

const icons = ref({
  mdiLock,
  mdiLogout
});

const componentProps = defineProps({
  drawer: {
    type: Boolean,
    default: false
  },
  selectedContract: {
    type: String,
    default: ""
  }
});
const emit = defineEmits(["closeDrawer"]);
const store = useStore();
const theme = useTheme();
const { t } = useI18n();
const target = useTemplateRef("target");
const { activate, deactivate } = useFocusTrap(target, {
  immediate: false
});
const user = computed(() => store.getters["user"]);
const groupOpen = ref(false);
const firstLetter = computed(() => {
  if (user.value === null) return "";

  return user.value.first_name.charAt(0);
});

const menuItems = computed(() => [
  {
    text: t("app.settings"),
    to: { name: "settings" },
    icon: mdiAccountCog,
    loggedOut: false,
    withoutContract: true
  },
  {
    text: "FAQ",
    to: { name: "faq" },
    icon: mdiHelp,
    loggedOut: true
  }
]);

const links = computed(() => [
  {
    text: t("app.dashboard"),
    to: { name: "dashboard" },
    icon: mdiHome,
    loggedOut: false
  },
  {
    text: t("app.calendar"),
    to: { name: "calendar" },
    icon: mdiCalendar,
    loggedOut: false
  },
  {
    text: t("app.shifts"),
    to: { name: "shiftList" },
    icon: mdiFormatListNumbered,
    loggedOut: false
  },
  {
    text: t("app.contracts"),
    to: { name: "contractList" },
    icon: mdiFileDocument,
    loggedOut: false
  },
  {
    text: t("app.reports"),
    to: { name: "reporting" },
    icon: mdiFileChart,
    loggedOut: false
  }
]);

const imgSrc = computed(() => (theme.current.dark ? darkSvg : svg));
watch(
  () => componentProps.drawer,
  async (value) => {
    if (value) {
      document.documentElement.style.overflow = "hidden";
      document.getElementById("first-item").focus();
      await nextTick();
      activate();
    } else {
      document.documentElement.style.overflow = "auto";
      await nextTick();
      deactivate();
    }
  }
);

onMounted(() => {
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && componentProps.drawer) {
      closeDrawer(false);
    }
  });
});
onBeforeUnmount(() => {
  document.removeEventListener("keydown", (event) => {
    if (event.key === "Escape" && componentProps.drawer) {
      closeDrawer(false);
    }
  });
});
function closeDrawer(value) {
  if (!value) {
    emit("closeDrawer");
  }
}
</script>

<template>
  <v-navigation-drawer
    :model-value="componentProps.drawer"
    role="dialog"
    aria-orientation="vertical"
    aria-modal="true"
    left
    disable-resize-watcher
    temporary
    @update:model-value="closeDrawer"
  >
    <div ref="target">
      <v-list
        id="first-item"
        :aria-label="t('label.dashboard.navDrawer')"
        role="menu"
      >
        <v-list-item>
          <RouterLink
            style="display: inline-flex"
            role="link"
            type="link"
            :aria-label="t('label.dashboard.toDashboard')"
            :to="{ name: 'home' }"
          >
            <v-img width="240px" height="36px" :src="imgSrc" />
            <h1 class="sr-only">CLOCK</h1>
          </RouterLink>
          <v-divider></v-divider>
        </v-list-item>
        <v-list-group role="group">
          <template #activator="{ props }">
            <v-list-item
              role="button"
              type="button"
              v-bind="props"
              :aria-expanded="groupOpen"
              aria-labelledby="user-menu"
              @click="groupOpen = !groupOpen.value"
              @keydown.space="groupOpen = !groupOpen.value"
              @keydown.enter="groupOpen = !groupOpen.value"
            >
              <template #prepend="prependProps">
                <v-avatar
                  aria-hidden="true"
                  v-bind="prependProps"
                  size="32px"
                  color="blue-lighten-2"
                  style="cursor: pointer"
                >
                  <div class="text-white">
                    {{ firstLetter }}
                  </div>
                </v-avatar>
              </template>
              <p class="text-h6">
                {{ user.first_name }}
              </p>
              <span id="user-menu" class="sr-only">
                {{ $t("label.dashboard.userMenu") }}</span
              >
            </v-list-item>
          </template>

          <v-list-item
            v-for="item in menuItems"
            :key="item.text"
            :to="item.to"
            type="link"
            role="link"
            class="drawer-focusable"
            style="--indent-padding: calc(var(--list-indent-size) - 12px)"
          >
            <template #prepend="prependProps">
              <v-icon :icon="item.icon" v-bind="prependProps"></v-icon>
            </template>
            <p :aria-hidden="item.text === 'FAQ'" style="padding-left: 4px">
              {{ item.text }}
            </p>
            <span v-if="item.text === 'FAQ'" class="sr-only">F A Q</span>
          </v-list-item>

          <LogoutDialog>
            <template #activator="{ props }">
              <v-list-item
                data-cy="menu-logout"
                role="button"
                type="button"
                :prepend-icon="icons.mdiLogout"
                v-bind="props"
                style="--indent-padding: calc(var(--list-indent-size) - 12px)"
              >
                <template #prepend="prependProps">
                  <v-icon
                    :icon="icons.mdiLogout"
                    v-bind="prependProps"
                  ></v-icon>
                </template>
                <p style="padding-left: 4px">{{ $t("app.logout") }}</p>
              </v-list-item>
            </template>
          </LogoutDialog>
        </v-list-group>
        <v-divider role="separator"></v-divider>
        <v-list-item
          v-for="link in links"
          :key="link.text"
          type="link"
          role="link"
          :prepend-icon="link.icon"
          :to="link.to"
        >
          <p>{{ link.text }}</p>
        </v-list-item>
      </v-list>
    </div>
  </v-navigation-drawer>
</template>

<style scoped>
::v-deep(.v-list-item) {
  tab-index: -2;
}
</style>
