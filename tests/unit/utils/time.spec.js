import { startEndHours, timedeltaToMinutes } from "@/utils/time";

describe("When handling a timedelta", () => {
  it("converts '10:00:00' to 600 minutes", () => {
    expect(timedeltaToMinutes("10:00:00")).toEqual(600);
  });

  it("converts '00:00:00' to 0 minutes", () => {
    expect(timedeltaToMinutes("00:00:00")).toEqual(0);
  });

  it("converts '1 00:00:00' to 1440 minutes", () => {
    expect(timedeltaToMinutes("1 00:00:00")).toEqual(1440);
  });

  it("converts '-1 16:00:00' to -480 minutes", () => {
    expect(timedeltaToMinutes("-1 16:00:00")).toEqual(-480);
  });

  it("converts '-5 16:00:00' to -5820 minutes", () => {
    expect(timedeltaToMinutes("-5 23:00:00")).toEqual(-5820);
  });
});

describe("startEndHours()", () => {
  it("always return shift buffered one hour around current time", () => {
    expect(startEndHours(new Date(2018, 9, 1, 0, 0))).toEqual({
      start: new Date(2018, 9, 1, 0, 0),
      end: new Date(2018, 9, 1, 1, 0)
    });

    expect(startEndHours(new Date(2018, 9, 1, 0, 20))).toEqual({
      start: new Date(2018, 9, 1, 0, 20),
      end: new Date(2018, 9, 1, 1, 20)
    });

    expect(startEndHours(new Date(2018, 9, 1, 23))).toEqual({
      start: new Date(2018, 9, 1, 22, 59),
      end: new Date(2018, 9, 1, 23, 59)
    });

    expect(startEndHours(new Date(2018, 9, 1, 10, 25))).toEqual({
      start: new Date(2018, 9, 1, 9, 25),
      end: new Date(2018, 9, 1, 10, 25)
    });
  });
});
