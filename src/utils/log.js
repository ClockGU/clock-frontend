/* eslint-disable no-console */
import { debugLogger } from "@/main";

export const log = (message, args) => {
  if (!debugLogger) return;

  if (args !== undefined) {
    console.log(message, args);
  } else {
    console.log(message);
  }
};
