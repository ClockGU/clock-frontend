<template>
  <shift-model :uuid="uuid">
    <v-card min-width="90vw" slot-scope="{ data: shift, create, update }">
      <v-card-text>
        <v-layout row wrap align-center>
          <v-flex xs2>
            <v-menu
              ref="menu"
              v-model="menu1"
              :close-on-content-click="false"
              lazy
              transition="scale-transition"
              offset-y
              full-width
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="shift.started.date"
                  v-on="on"
                  max-width="100px"
                ></v-text-field>
              </template>
              <v-date-picker
                no-title
                v-model="shift.started.date"
                @click:date="menu = false"
              ></v-date-picker>
            </v-menu>
          </v-flex>
          <v-flex xs1>
            <v-menu
              ref="menu"
              v-model="menu2"
              :close-on-content-click="false"
              lazy
              transition="scale-transition"
              offset-y
              full-width
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="shift.started.time"
                  v-on="on"
                  max-width="100px"
                ></v-text-field>
              </template>
              <v-time-picker
                no-title
                v-model="shift.started.time"
                format="24hr"
                @click:time="menu = false"
              ></v-time-picker>
            </v-menu>
          </v-flex>
          <v-flex offset-xs1 xs1>to</v-flex>
          <v-flex xs2>
            <v-menu
              ref="menu"
              v-model="menu3"
              :close-on-content-click="false"
              lazy
              transition="scale-transition"
              offset-y
              full-width
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="shift.finished.date"
                  v-on="on"
                  max-width="100px"
                ></v-text-field>
              </template>
              <v-date-picker
                no-title
                v-model="shift.finished.date"
                @click:date="menu = false"
              ></v-date-picker>
            </v-menu>
          </v-flex>
          <v-flex xs1>
            <v-menu
              ref="menu"
              v-model="menu4"
              :close-on-content-click="false"
              lazy
              transition="scale-transition"
              offset-y
              full-width
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="shift.finished.time"
                  v-on="on"
                  max-width="100px"
                ></v-text-field>
              </template>
              <v-time-picker
                no-title
                v-model="shift.finished.time"
                format="24hr"
                @click:time="menu = false"
              ></v-time-picker>
            </v-menu>
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat @click="submit({ create: create, update: update })"
          >Submit</v-btn
        >
      </v-card-actions>
    </v-card>
  </shift-model>
</template>

<script>
import ShiftModel from "@/components/ShiftModel";

export default {
  name: "ShiftForm",
  components: { ShiftModel },
  data: () => ({
    date: new Date().toISOString().substr(0, 10),
    menu1: false,
    menu2: false,
    menu3: false,
    menu4: false
  }),
  props: {
    uuid: {
      type: String,
      default: null
    }
  },
  methods: {
    submit(callback) {
      this.uuid === null ? callback.create() : callback.update();
    }
  }
};
</script>
