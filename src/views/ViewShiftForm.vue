<template>
  <v-container>
    <FrameApi
      v-if="endpoint"
      v-slot="{ methods: { query }, status: { error, loading } }"
      :endpoint="endpoint"
      @success="redirect"
    >
      <ShiftForm v-if="entity" :query="query" :uuid="uuid" :entity="entity" />
    </FrameApi>

    <ShiftForm
      v-if="endpoint === null && entity"
      :query="query"
      :uuid="uuid"
      :entity="entity"
    />
  </v-container>
</template>

<script>
import ShiftForm from "@/components/shifts/ShiftForm";
import { Shift } from "@/models/ShiftModel";
import ShiftService from "@/services/shift.service";
import FrameApi from "@/components/FrameApi";

export default {
  name: "ViewShiftForm",
  components: { FrameApi, ShiftForm },
  props: {
    uuid: {
      type: String,
      default: null
    },
    pseudo: {
      type: Boolean,
      default: false
    },
    routerPush: {
      type: Object,
      default: () => ({ name: "c" })
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

    let entity;
    if (this.pseudo) {
      entity = this.$store.state.shift.pseudoShifts.find(
        shift => shift.uuid === this.uuid
      );
      this.query = this.updatePseudoShift;
    } else {
      entity = shifts.find(shift => shift.uuid === this.uuid);
      this.endpoint = data =>
        this.uuid === null
          ? ShiftService.create(data.toPayload())
          : ShiftService.update(data.toPayload(), this.uuid);
    }

    if (entity !== undefined) {
      this.entity = new Shift(entity);
    } else if (this.uuid != null) {
      const response = await ShiftService.get(this.uuid);
      this.entity = new Shift(response.data);
    } else {
      this.entity = new Shift();
    }
  },
  methods: {
    updatePseudoShift(shift) {
      this.$store.dispatch("shift/updatePseudoShift", shift);
    },
    redirect({ data }) {
      console.log(data);
      return new Promise((resolve, reject) => {
        data
          .then(() => {
            this.$router.push({ name: "reviewShifts" });

            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  }
};
</script>
