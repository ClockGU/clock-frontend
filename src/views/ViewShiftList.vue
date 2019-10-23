<template>
  <ShiftListFrame>
    <FrameHooks
      slot-scope="{ shifts, methods: { fetchList }, status: { loading } }"
      @created="fetchList()"
    >
      <ShiftTable :loading="loading" :shifts="shifts" @delete="fetchList()" />
    </FrameHooks>
  </ShiftListFrame>
</template>

<script>
import ShiftListFrame from "@/components/shifts/ShiftListFrame";
import ShiftTable from "@/components/shifts/ShiftTable";
import FrameHooks from "@/components/FrameHooks";

export default {
  name: "ViewShiftList",
  components: { ShiftListFrame, ShiftTable, FrameHooks }
};
</script>
