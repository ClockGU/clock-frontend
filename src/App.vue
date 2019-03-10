<template>
  <v-app id="keep">
    <v-navigation-drawer
      v-model="drawer"
      fixed
      clipped
      class="grey lighten-4"
      app
    >
      <p>Test</p>
    </v-navigation-drawer>
    <v-toolbar color="amber" app absolute flat clipped-left>
      <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
      <span class="title ml-3 mr-5"
        >Google&nbsp;<span class="font-weight-light">Keep</span></span
      >
      <v-text-field solo-inverted hide-details label="Search"></v-text-field>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content>
      <v-container fluid pa-0>
        <v-layout row wrap justify-center>
          <v-flex xs12>
            <v-sheet height="100vw">
              <v-calendar
                :show-month-on-first="false"
                ref="calendar"
                color="primary"
                :locale="locale"
                :type="type"
                v-model="start"
                :end="end"
              ></v-calendar>
            </v-sheet>
          </v-flex>

          <v-flex sm4 xs12 row wrap>
            <v-btn icon @click="$refs.calendar.prev()">
              <v-icon dark left>keyboard_arrow_left</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <span>{{ start }}</span>
            <v-btn icon @click="$refs.calendar.next()">
              <v-icon dark left>keyboard_arrow_right</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    type: "month",
    start: "2019-01-01",
    end: "2019-01-06",
    typeOptions: [
      { text: "Day", value: "day" },
      { text: "4 Day", value: "4day" },
      { text: "Week", value: "week" },
      { text: "Month", value: "month" },
      { text: "Custom Daily", value: "custom-daily" },
      { text: "Custom Weekly", value: "custom-weekly" }
    ],
    locale: "en-us",
    drawer: null
  })
};
</script>
