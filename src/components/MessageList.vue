<template>
  <v-list two-line>
    <v-list-item-group
      v-model="selected"
      multiple
      active-class="pink--text darken-5"
    >
      <template v-for="(message, index) in messages">
        <v-list-item :key="message.uuid">
          <template v-slot:default="{ active }">
            <v-list-item-content>
              <v-list-item-title v-text="message.title"></v-list-item-title>
              <v-list-item-subtitle
                class="text--primary"
                v-text="message.type"
              ></v-list-item-subtitle>
              <v-list-item-subtitle
                v-text="message.text"
              ></v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-list-item-action-text
                v-text="message.createdReadable"
              ></v-list-item-action-text>
              <v-icon v-if="!active" color="grey lighten-1">
                {{ icons.mdiStarCircleOutline }}
              </v-icon>

              <v-icon v-else color="red">
                {{ icons.mdiStarCircle }}
              </v-icon>
            </v-list-item-action>
          </template>
        </v-list-item>

        <v-divider v-if="index + 1 < messages.length" :key="index"></v-divider>
      </template>
    </v-list-item-group>
  </v-list>
</template>

<script>
// import { mapGetters } from "vuex";

import { mdiStarCircle, mdiStarCircleOutline } from "@mdi/js";

export default {
  name: "MessageList",
  props: {
    messages: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    icons: { mdiStarCircle, mdiStarCircleOutline },
    selected: []
  })
  // computed: {
  //   ...mapGetters({
  //     messages: "messages/getMessages"
  //   })
  // }
};
</script>
