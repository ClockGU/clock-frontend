import ClockModel from "@/models/ClockModel";
import { mockDate } from "../../mocks";

describe("Clock utility", () => {
  it("accepts a date as startDate", () => {
    const date = new Date(2019, 10, 20, 10);
    const clock = new ClockModel({ startDate: date });
    expect(clock.startDate).toEqual(date);
  });

  it("accepts nothing as startDate", () => {
    let resetDateMock = mockDate(new Date("2019-10-20T10:00:00.00Z"));
    const clock = new ClockModel({});
    expect(clock.startDate).toEqual(new Date());
    resetDateMock();
  });

  it("has no duration on init", () => {
    const clock = new ClockModel();
    expect(clock.duration).toBeNull();
  });

  it("has no interval on init", () => {
    const clock = new ClockModel();
    expect(clock.interval).toBeNull();
  });

  it("has an initialize function for a reset", () => {
    jest.useFakeTimers();
    let resetDateMock = mockDate(new Date("2019-10-20T10:00:00.00Z"));
    const clock = new ClockModel();
    clock.start();
    expect(clock.interval).not.toBeNull();
    expect(clock.startDate).toEqual(new Date());

    resetDateMock = mockDate(new Date("2019-10-20T11:00:00.00Z"));
    clock.stop();
    expect(clock.interval).toBeNull();
    expect(clock.duration).toBeNull();
    expect(clock.startDate).toEqual(new Date());

    resetDateMock();
  });

  it("clears the interval", () => {
    const clock = new ClockModel();
    clock.resetInterval();
    expect(clock.interval).toBeNull();
  });

  it("increments duration with the tick method", () => {
    let resetDateMock = mockDate(new Date("2019-10-20T10:00:00.00Z"));
    const clock = new ClockModel();

    resetDateMock = mockDate(new Date("2019-10-20T10:01:00.00Z"));
    clock.tick();
    expect(clock.duration).toEqual(60);

    resetDateMock();
  });

  it("progresses time every second after starting", () => {
    jest.useFakeTimers();
    let resetDateMock = mockDate(new Date("2019-10-20T10:00:00.00Z"));
    const clock = new ClockModel();
    clock.start();
    expect(clock.interval).not.toBeNull();

    resetDateMock = mockDate(new Date("2019-10-20T10:01:00.00Z"));
    jest.advanceTimersByTime(6000);
    expect(clock.duration).toEqual(60);
    resetDateMock();
  });

  it("pause stops the time progression", () => {
    jest.useFakeTimers();
    let resetDateMock = mockDate(new Date("2019-10-20T10:00:00.00Z"));
    const clock = new ClockModel();
    clock.start();

    resetDateMock = mockDate(new Date("2019-10-20T10:01:00.00Z"));
    jest.advanceTimersByTime(6000);
    resetDateMock();

    clock.pause();
    expect(clock.duration).toEqual(60);
    expect(clock.interval).toBeNull();
  });

  it("toggles the clock correctly", () => {
    jest.useFakeTimers();
    let resetDateMock = mockDate(new Date("2019-10-20T10:00:00.00Z"));
    const clock1 = new ClockModel();
    clock1.toggle();
    expect(clock1.duration).toEqual(0);
    expect(clock1.interval).not.toBeNull();
    resetDateMock = mockDate(new Date("2019-10-20T10:01:00.00Z"));
    jest.advanceTimersByTime(6000);
    clock1.toggle();
    expect(clock1.duration).toEqual(60);
    expect(clock1.interval).toBeNull();

    const clock2 = new ClockModel();
    clock2.start();
    resetDateMock = mockDate(new Date("2019-10-20T10:01:00.00Z"));
    jest.advanceTimersByTime(6000);
    clock2.toggle();
    expect(clock1.duration).toEqual(60);
    expect(clock1.interval).toBeNull();

    resetDateMock();
  });

  it("stop cleans up the clock", () => {
    jest.useFakeTimers();
    let resetDateMock = mockDate(new Date("2019-10-20T10:00:00.00Z"));
    const clock = new ClockModel();
    clock.start();

    resetDateMock = mockDate(new Date("2019-10-20T10:01:00.00Z"));
    jest.advanceTimersByTime(6000);

    clock.stop();
    expect(clock.duration).toEqual(null);
    expect(clock.interval).toBeNull();
    expect(clock.startDate).toEqual(new Date());
    resetDateMock();
  });
});
