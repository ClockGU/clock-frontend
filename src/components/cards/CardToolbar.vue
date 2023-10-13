<template>
  <v-card-title flat>
    <v-toolbar flat>
      <v-toolbar-title>
        {{ title }}
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <LanguageSwitcher />
      <v-btn v-if="logoutAction" variant="text" @click="logout">
        {{ $t("actions.logout") }}
      </v-btn>
      <v-btn v-if="closeAction" icon @click="close">
        <v-icon>
          {{ icons.mdiClose }}
        </v-icon>
      </v-btn>
    </v-toolbar>
  </v-card-title>
</template>

<script>
import { mdiClose } from "@mdi/js";
import LanguageSwitcher from "@/components/LanguageSwitcher.vue";

export default {
  name: "CardToolbar",
  components: { LanguageSwitcher },
  props: {
    title: {
      type: String,
      required: true
    },
    logoutAction: {
      type: Boolean,
      required: false,
      default: false
    },
    closeAction: {
      type: Boolean,
      required: false,
      default: false
    }
  },
emits: ['close'],
  data() {
    return {
      icons: {
        mdiClose
      }
    };
  },
  methods: {
    logout() {
      this.$store.dispatch("auth/LOGOUT");
    },
    close() {
      this.$emit("close");
    }
  }
};
</script>

<style scoped lang="scss">
.theme--dark.v-toolbar.v-sheet {
  background-color: #1e1e1e;
}
:deep(.v-toolbar-title__placeholder) {
  text-overflow: unset;
}
</style>
