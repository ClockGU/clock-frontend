import { vi } from "vitest";
export const mockDate = (expected) => {
  // Callback function to remove the Date mock
  vi.useFakeTimers();
  vi.setSystemTime(expected);

  return {
    reset: vi.useRealTimers,
    oneMinProg: () => vi.advanceTimersByTime(60000)
  };
};
