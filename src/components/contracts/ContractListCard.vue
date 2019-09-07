<template>
  <v-col cols="12" sm="6" md="4">
    <v-hover>
      <template v-slot:default="{ hover }">
        <v-card
          class="mx-auto"
          max-width="350"
          outlined
          :elevation="hover ? 2 : 0"
          @click="selectContract(contract)"
        >
          <!-- <v-list-item three-line>
            <v-list-item-content>
              <div class="overline mb-4">
                {{ contract.hours | hoursToWorktime }} per month
              </div>
              <v-list-item-title class="headline mb-1">
                {{ contract.name }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ contract.date.start | toDate }} until
                {{ contract.date.end | toDate }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item> -->
          <v-card-title>
            <span class="primary--text subtitle-2">
              {{ contract.hours | hoursToWorktime }} per month
            </span>
          </v-card-title>

          <v-card-text>
            <h2 class="title primary-text">{{ contract.name }}</h2>
            {{ contract.date.start | toDate }} until
            {{ contract.date.end | toDate }}
          </v-card-text>

          <v-card-actions v-if="editMode">
            <v-spacer></v-spacer>
            <v-btn text color="error" @click="$emit('delete')">Delete</v-btn>
            <v-btn
              text
              :to="{
                name: 'editContract',
                params: { uuid: contract.uuid }
              }"
              >Edit</v-btn
            >
          </v-card-actions>
        </v-card>
      </template>
    </v-hover>
  </v-col>
</template>

<script>
import { format } from "date-fns";

export default {
  name: "ContractListCard",
  filters: {
    toDate(date) {
      return format(date, "YYYY-MM-DD");
    },
    hoursToWorktime(value) {
      const hours = Math.floor(value);
      const minutes = parseInt((60 * (value - hours)).toFixed(0));

      return `${hours.pad(2)}:${minutes.pad(2)}`;
    }
  },
  props: {
    contract: {
      type: Object,
      required: true
    },
    editMode: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    selectContract(contract) {
      this.$store.dispatch("setContract", contract);

      this.$router.push({ name: "c" });
    }
  }
};
</script>
