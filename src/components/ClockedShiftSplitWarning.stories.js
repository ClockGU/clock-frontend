import { storiesOf } from "@storybook/vue";

import store from "@/store";
import ClockedShiftSplitWarning from "@/components/ClockedShiftSplitWarning";

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

storiesOf("ClockedShiftSplitWarning", module).add("Shift too short", () => {
  return {
    store,
    components: { ClockedShiftSplitWarning },
    template: `<ClockedShiftSplitWarning :shift="shift" :callbacks="callbacks" />`,
    data: () => ({
      callbacks,
      shift
    })
  };
});
