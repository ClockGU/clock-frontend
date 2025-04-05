<template>
  <v-card>
    <v-card-title>
      {{ $t("dashboard.reviewShifts") }}
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
        {{ $t("dashboard.noReviewableShifts") }}
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
