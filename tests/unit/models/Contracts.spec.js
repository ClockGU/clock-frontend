import { defaultContractDate } from "@/utils/date";
import { Contract } from "@/models/ContractModel";
import { addDays } from "date-fns";

describe("Contracts/defaultContractDate()", () => {
  // Winter term tests
  it("returns correct start date for winter term given the starting edge", () => {
    expect(defaultContractDate({ type: "start", date: new Date(2018, 9, 1) })).toEqual(
      new Date(2018, 9, 1)
    );
  });

  it("returns correct start date for winter term", () => {
    expect(defaultContractDate({ type: "start", date: new Date(2019, 1, 1) })).toEqual(
      new Date(2018, 9, 1)
    );
  });

  it("returns correct end date for winter term given the ending edge", () => {
    expect(defaultContractDate({ type: "end", date: new Date(2019, 2, 31) })).toEqual(
      new Date(2019, 2, 31)
    );
  });

  it("returns correct end date for winter term", () => {
    expect(defaultContractDate({ type: "end", date: new Date(2019, 1, 1) })).toEqual(
      new Date(2019, 2, 31)
    );
  });

  // Summer term tests
  it("returns correct start date for summer term given the starting edge", () => {
    expect(defaultContractDate({ type: "start", date: new Date(2018, 3, 1) })).toEqual(
      new Date(2018, 3, 1)
    );
  });

  it("returns correct start date for summer term", () => {
    expect(defaultContractDate({ type: "start", date: new Date(2019, 5, 1) })).toEqual(
      new Date(2019, 3, 1)
    );
  });

  it("returns correct end date for summer term given the ending edge", () => {
    expect(defaultContractDate({ type: "end", date: new Date(2019, 8, 30) })).toEqual(
      new Date(2019, 8, 30)
    );
  });

  it("returns correct end date for summer term", () => {
    expect(defaultContractDate({ type: "end", date: new Date(2019, 5, 1) })).toEqual(
      new Date(2019, 8, 30)
    );
  });
});

describe("Contracts.js", () => {
  const date = {
    start: new Date(Date.UTC(2019, 0, 1)),
    end: new Date(Date.UTC(2019, 1, 1))
  };

  it("creates a new Contract instance with date arguments", () => {
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
      date: date
    };
    const obj = new Contract(data);
    expect(obj).toEqual(data);
  });

  it("sets and gets the start and end date", () => {
    const obj = new Contract({ date: date });
    const newStart = new Date(Date.UTC(2019, 1, 1));
    const newEnd = new Date(Date.UTC(2019, 2, 31));

    // Check old dates
    expect(obj.start == date.start);
    expect(obj.end == date.end);

    // Set new dates
    obj.start = newStart;
    obj.end = newEnd;

    // Check new dates
    expect(obj.start == newStart);
    expect(obj.end == newEnd);
  });

  it("calculates the contract duration in days", () => {
    const obj = new Contract({ date: date });
    expect(obj.duration).toBe(31);
  });

  it("calculates the remaining contract duration in days", () => {
    const today = new Date();
    const inTenDays = addDays(today, 10);

    const date = {
      start: today,
      end: inTenDays
    };
    const obj = new Contract({
      date: date
    });
    expect(obj.remainingContractDuration).toBe(10);
  });
});
