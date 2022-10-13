<template>
  <v-toolbar :max-width="maxWidth" flat>
    <v-toolbar-title>
      {{ title }}
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <LanguageSwitcher />
    <v-btn v-if="logoutAction" text @click="logout">
      {{ $t("actions.logout") }}
    </v-btn>
    <v-btn v-if="closeAction" icon @click="close">
      <v-icon>
        {{ icons.mdiClose }}
      </v-icon>
    </v-btn>
  </v-toolbar>
</template>

<script>
import { mdiClose } from "@mdi/js";
import LanguageSwitcher from "@/components/LanguageSwitcher";

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
    },
    maxWidth: {
      type: Number,
      required: false,
      default: 600
    }
  },
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
