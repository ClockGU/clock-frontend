import { Contract } from "@/models/ContractModel";
import { addDays } from "date-fns";
import timekeeper from "timekeeper";

describe("Contracts.js", () => {
  const date = {
    startDate: new Date(Date.UTC(2021, 0, 1)).toISOString(),
    endDate: new Date(Date.UTC(2021, 1, 1)).toISOString()
  };

  it("creates a new Contract instance with date arguments", () => {
    timekeeper.travel(date.startDate);
    timekeeper.freeze(date.startDate);
    const obj = new Contract(date);
    expect(obj).toEqual({
      id: "",
      user: "",
      name: "",
      minutes: 0,
      startDate: new Date(Date.UTC(2021, 0, 1)),
      endDate: new Date(Date.UTC(2021, 1, 1)),
      initialCarryoverMinutes: 0,
      initialVacationCarryoverMinutes: 0,
      color: "#8ac5ff",
      worktimeModelName: null,
      percentFte: 0.0,
      createdAt: new Date(Date.UTC(2021, 0, 1)),
      modifiedAt: new Date(Date.UTC(2021, 0, 1)),
      lastUsed: new Date(Date.UTC(2021, 0, 1))
    });
    timekeeper.reset();
  });

  it("creates a new Contract instance with all arguments", () => {
    const data = {
      id: "1234",
      user: "user",
      name: "name",
      minutes: 2400,
      startDate: new Date(Date.UTC(2021, 0, 1)).toISOString(),
      endDate: new Date(Date.UTC(2021, 1, 1)).toISOString(),
      initialCarryoverMinutes: 0,
      initialVacationCarryoverMinutes: 0,
      worktimeModelName: "regEmp",
      percentFte: 0.0,
      createdAt: new Date(Date.UTC(2021, 0, 1)).toISOString(),
      modifiedAt: new Date(Date.UTC(2021, 0, 1)).toISOString(),
      lastUsed: new Date(Date.UTC(2021, 0, 1)).toISOString()
    };
    const output = {
      id: "1234",
      user: "user",
      name: "name",
      minutes: 2400,
      startDate: new Date(Date.UTC(2021, 0, 1)),
      endDate: new Date(Date.UTC(2021, 1, 1)),
      initialCarryoverMinutes: 0,
      initialVacationCarryoverMinutes: 0,
      color: "#8ac5ff",
      worktimeModelName: "regEmp",
      percentFte: 0.0,
      createdAt: new Date(Date.UTC(2021, 0, 1)),
      modifiedAt: new Date(Date.UTC(2021, 0, 1)),
      lastUsed: new Date(Date.UTC(2021, 0, 1))
    };

    expect(new Contract(data)).toEqual(output);
  });

  it("calculates the contract duration in days", () => {
    const obj = new Contract(date);
    expect(obj.duration).toBe(31);
  });

  it("calculates the remaining contract duration in days", () => {
    const today = new Date();
    const inTenDays = addDays(today, 10);

    const onlyDateData = {
      startDate: today,
      endDate: inTenDays
    };
    const obj = new Contract(onlyDateData);
    expect(obj.remainingContractDuration).toBe(10);
  });
});
