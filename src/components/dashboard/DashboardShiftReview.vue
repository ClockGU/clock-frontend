<template>
  <v-card>
    <v-card-title>
      <h2>{{ $t("dashboard.reviewShifts") }}</h2>
    </v-card-title>
    <v-card-text>
      <div v-if="shiftsToReview.length > 0">
        <v-list>
          <ReviewShiftListItem
            v-for="id in shiftsToReview.keys()"
            :key="id"
            v-model="shiftsToReview[id]"
          />
        </v-list>
      </div>
      <v-container v-else>
        <h3>
          {{ $t("dashboard.noReviewableShifts") }}
        </h3>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import ReviewShiftListItem from "@/components/shifts/ReviewShiftListItem.vue";

export default {
  name: "DashboardShiftReview",
  components: { ReviewShiftListItem },
  computed: {
    shiftsToReview() {
      if (this.$store.getters["contentData/selectedShifts"] === undefined)
        return [];
      return this.$store.getters["contentData/selectedShifts"]
        .filter((shift) => !shift.wasReviewed && shift.stopped <= Date.now())
        .slice(0, 5);
    }
  }
};
</script>

<style scoped></style>
