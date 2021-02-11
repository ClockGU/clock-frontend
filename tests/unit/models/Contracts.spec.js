import { Contract } from "@/models/ContractModel";
import { addDays } from "date-fns";

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
      worktime: null,
      date: date,
      carryoverMinutes: "00:00",
      carryoverTargetDate: new Date(2020, 8, 31, 0)
    });
  });

  it("creates a new Contract instance with all arguments", () => {
    const data = {
      uuid: "1234",
      user: "user",
      name: "name",
      date: date,
      carryoverMinutes: "00:00",
      carryoverTargetDate: new Date(2020, 8, 31, 0)
    };

    const output = {
      ...data,
      worktime: "40:00"
    };

    expect(new Contract({ ...data, minutes: 2400 })).toEqual(output);
  });

  it("converts worktime user input / API response back and forth correctly", () => {
    let data = {
      uuid: "1234",
      user: "user",
      name: "name",
      date: date,
      carryoverMinutes: "00:00",
      carryoverTargetDate: new Date(2020, 8, 31, 0)
    };

    expect(new Contract({ ...data, minutes: 600 })).toEqual({
      ...data,
      worktime: "10:00"
    });

    expect(new Contract({ ...data, minutes: 50 })).toEqual({
      ...data,
      worktime: "00:50"
    });
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
