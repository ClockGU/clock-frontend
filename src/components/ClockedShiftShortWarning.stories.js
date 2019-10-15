import { storiesOf } from "@storybook/vue";

import store from "@/store";
import ClockedShiftShortWarning from "@/components/ClockedShiftShortWarning";

export const callbacks = {
  stop: () => ({}),
  unpause: () => ({}),
  reset: () => ({})
};

export const shift = {
  date: {
    start: new Date(2019, 9, 7, 15),
    end: new Date(2019, 9, 8, 10)
  }
};

storiesOf("ClockedShiftShortWarning", module).add("Shift too short", () => {
  return {
    store,
    components: { ClockedShiftShortWarning },
    data() {
      return {
        shift: { date: null },
        callbacks
      };
    },
    template: `<ClockedShiftShortWarning :callbacks="callbacks" :shift="shift" />`
  };
});
