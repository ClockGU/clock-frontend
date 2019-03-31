import { defaultDate } from "@/models/Contracts";
import { Contract } from "@/models/Contracts";

describe("Contracts/defaultDate()", () => {
  // Winter term tests
  it("returns correct start date for winter term given the starting edge", () => {
    expect(defaultDate({ type: "start", date: new Date(2018, 9, 1) })).toEqual(
      new Date(2018, 9, 1)
    );
  });

  it("returns correct start date for winter term", () => {
    expect(defaultDate({ type: "start", date: new Date(2019, 1, 1) })).toEqual(
      new Date(2018, 9, 1)
    );
  });

  it("returns correct end date for winter term given the ending edge", () => {
    expect(defaultDate({ type: "end", date: new Date(2019, 2, 31) })).toEqual(
      new Date(2019, 2, 31)
    );
  });

  it("returns correct end date for winter term", () => {
    expect(defaultDate({ type: "end", date: new Date(2019, 1, 1) })).toEqual(
      new Date(2019, 2, 31)
    );
  });

  // Summer term tests
  it("returns correct start date for summer term given the starting edge", () => {
    expect(defaultDate({ type: "start", date: new Date(2018, 3, 1) })).toEqual(
      new Date(2018, 3, 1)
    );
  });

  it("returns correct start date for summer term", () => {
    expect(defaultDate({ type: "start", date: new Date(2019, 5, 1) })).toEqual(
      new Date(2019, 3, 1)
    );
  });

  it("returns correct end date for summer term given the ending edge", () => {
    expect(defaultDate({ type: "end", date: new Date(2019, 8, 30) })).toEqual(
      new Date(2019, 8, 30)
    );
  });

  it("returns correct end date for summer term", () => {
    expect(defaultDate({ type: "end", date: new Date(2019, 5, 1) })).toEqual(
      new Date(2019, 8, 30)
    );
  });
});

describe("Contracts.js", () => {
  it("creates a new Contract instance with date arguments", () => {
    const date = {
      start: new Date(2019, 0, 1, 10, 0),
      end: new Date(2019, 0, 1, 15, 0)
    };
    const obj = new Contract({ date: date });
    expect(obj).toEqual({
      uuid: null,
      user: null,
      name: null,
      hours: null,
      date: date
    });
  });

  it("creates a new Contract instance with all arguments", () => {
    const data = {
      uuid: "1234",
      user: "user",
      name: "name",
      hours: 40,
      date: {
        start: new Date(2019, 0, 1, 10, 0),
        end: new Date(2019, 0, 1, 15, 0)
      }
    };
    const obj = new Contract(data);
    expect(obj).toEqual(data);
  });
});
