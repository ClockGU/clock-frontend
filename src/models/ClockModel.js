import is from "ramda/src/is";
import { differenceInSeconds } from "date-fns";

export default class Clock {
  constructor({ startDate = null } = {}) {
    this.initialize(startDate);
  }

  initialize(startDate) {
    this.startDate = is(Date, startDate) ? startDate : new Date();
    this.duration = null;
    this.interval = null;
  }

  start() {
    this.interval = setInterval(() => this.tick(), 1000);
    this.tick();
  }

  pause() {
    this.resetInterval();
  }

  stop() {
    this.resetInterval();
    this.initialize();
  }

  toggle() {
    this.duration === null ? this.start() : this.pause();
  }

  tick() {
    this.duration = differenceInSeconds(new Date(), this.startDate);
  }

  resetInterval() {
    clearInterval(this.interval);
    this.interval = null;
  }
}
