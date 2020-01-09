<template>
  <v-container>
    <ShiftForm
      v-if="entity"
      :now="now"
      :query="endpoint"
      :uuid="uuid"
      :entity="entity"
      @submit="redirect"
    />
  </v-container>
</template>

<script>
import ShiftForm from "@/components/shifts/ShiftForm";
import { Shift } from "@/models/ShiftModel";
import ShiftService from "@/services/shift";
import { handleApiError } from "../utils/interceptors";

export default {
  name: "ViewShiftForm",
  components: { ShiftForm },
  props: {
    now: {
      type: Date,
      default: () => new Date()
    },
    uuid: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      entity: null,
      endpoint: null
    };
  },
  async created() {
    const shifts = this.$store.state.shift.shifts;

    const entity = shifts.find(shift => shift.uuid === this.uuid);
    this.endpoint = data =>
      this.uuid === null
        ? ShiftService.create(data.toPayload())
        : ShiftService.update(data.toPayload(), this.uuid);

    if (entity !== undefined) {
      this.entity = new Shift(entity);
    } else if (this.uuid != null) {
      const response = await ShiftService.get(this.uuid).catch(handleApiError);
      this.entity = new Shift(response.data);
    } else {
      this.entity = new Shift({ date: { start: this.now } });
    }
  },
  methods: {
    redirect() {
      this.$router.push({ name: "c" });
    }
  }
  //   console.log(data);
  //   return new Promise((resolve, reject) => {
  //     data
  //       .then(() => {
  //         // this.$router.push({ name: "c" });

  //         resolve();
  //       })
  //       .catch(error => {
  //         reject(error);
  //       });
  //   });
  // }
  // }
};
</script>
