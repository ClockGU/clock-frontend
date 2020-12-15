<template>
  <v-list-item v-bind="$attrs" @click="$emit('show', message)">
    <v-list-item-content>
      <v-list-item-title v-text="message.title"></v-list-item-title>

      <v-list-item-subtitle
        class="text--primary"
        v-text="message.text"
      ></v-list-item-subtitle>
    </v-list-item-content>

    <v-list-item-action>
      <v-list-item-action-text v-text="message.distance"></v-list-item-action-text>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
export default {
  name: "MessageListItem",
  props: {
    message: {
      type: Object,
      required: true
    }
  }
}
</script>
