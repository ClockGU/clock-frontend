import { startEndHours } from "@/utils/time";

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
