import { Contract, mapContractApiResponse } from "@/models/ContractModel";
import { addDays, format } from "date-fns";
import timekeeper from "timekeeper";
import { v4 as uuidv4 } from "uuid";
import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock i18n
vi.mock("@/plugins/i18n", () => ({
  default: {
    global: {
      t: vi.fn((key, options) => {
        if (key === "contracts.perMonth") {
          return `${options.time} per month`;
        }
        if (key === "contracts.fte") {
          return `${options.percent}%`;
        }
        return key;
      })
    }
  }
}));

describe("mapContractApiResponse", () => {
  it("maps API response fields to frontend fields", () => {
    const apiResponse = {
      id: "1234",
      user: "user123",
      name: "Contract Name",
      reference: "ref123",
      minutes: 2400,
      start_date: "2021-01-01",
      end_date: "2021-02-01",
      initial_carryover_minutes: 120,
      initial_vacation_carryover_minutes: 240,
      created_at: "2021-01-01T00:00:00Z",
      modified_at: "2021-01-02T00:00:00Z",
      last_used: "2021-01-03T00:00:00Z",
      color: "#ff0000",
      worktime_model_name: "studEmp",
      percent_fte: 80.0
    };

    const result = mapContractApiResponse(apiResponse);

    expect(result).toEqual({
      id: "1234",
      user: "user123",
      name: "Contract Name",
      reference: "ref123",
      minutes: 2400,
      startDate: "2021-01-01",
      endDate: "2021-02-01",
      initialCarryoverMinutes: 120,
      initialVacationCarryoverMinutes: 240,
      createdAt: "2021-01-01T00:00:00Z",
      modifiedAt: "2021-01-02T00:00:00Z",
      lastUsed: "2021-01-03T00:00:00Z",
      color: "#ff0000",
      worktimeModelName: "studEmp",
      percentFte: 80.0
    });
  });
});

describe("Contract class", () => {
  const date = {
    startDate: "2021-01-01",
    endDate: "2021-02-01"
  };

  beforeEach(() => {
    // Reset timekeeper before each test
    timekeeper.reset();
  });

  describe("constructor", () => {
    it("creates a new Contract instance with date arguments", () => {
      const uuid = uuidv4();
      timekeeper.travel(date.startDate);
      timekeeper.freeze(date.startDate);
      const obj = new Contract({ ...date, reference: uuid });

      expect(obj instanceof Contract).toBe(true);
      expect(obj.id).toBe("");
      expect(obj.user).toBe("");
      expect(obj.name).toBe("");
      expect(obj.minutes).toBe(0);
      expect(obj.startDate).toEqual(new Date(2021, 0, 1));
      expect(obj.endDate).toEqual(new Date(2021, 1, 1));
      expect(obj.initialCarryoverMinutes).toBe(0);
      expect(obj.initialVacationCarryoverMinutes).toBe(0);
      expect(obj.color).toBe("#8ac5ff");
      expect(obj.worktimeModelName).toBeNull();
      expect(obj.percentFte).toBe(0.0);
      expect(obj.reference).toBe(uuid);
      // The Date.UTC call here is a "hack". We never encounter that those attributes will be set by the frontend effectively.
      expect(obj.createdAt).toEqual(new Date(Date.UTC(2021, 0, 1)));
      expect(obj.modifiedAt).toEqual(new Date(Date.UTC(2021, 0, 1)));
      expect(obj.lastUsed).toEqual(new Date(Date.UTC(2021, 0, 1)));
    });

    it("creates a new Contract instance with all arguments", () => {
      const uuid = uuidv4();
      const data = {
        id: "1234",
        user: "user",
        name: "name",
        minutes: 2400,
        startDate: "2021-01-01",
        endDate: "2021-02-01",
        initialCarryoverMinutes: 0,
        initialVacationCarryoverMinutes: 0,
        worktimeModelName: "regEmp",
        percentFte: 0.0,
        reference: uuid,
        createdAt: "2021-01-01",
        modifiedAt: "2021-01-01",
        lastUsed: "2021-01-01"
      };
      const output = {
        id: "1234",
        user: "user",
        name: "name",
        minutes: 2400,
        startDate: new Date(2021, 0, 1),
        endDate: new Date(2021, 1, 1),
        initialCarryoverMinutes: 0,
        initialVacationCarryoverMinutes: 0,
        color: "#8ac5ff",
        worktimeModelName: "regEmp",
        percentFte: 0.0,
        reference: uuid,
        createdAt: new Date(2021, 0, 1),
        modifiedAt: new Date(2021, 0, 1),
        lastUsed: new Date(2021, 0, 1)
      };

      expect(new Contract(data)).toEqual(output);
    });

    it("handles invalid input types correctly", () => {
      const contract = new Contract({
        id: 123, // Not a string
        user: 456, // Not a string
        name: 789, // Not a string
        minutes: "invalid", // Not a number
        percentFte: "invalid", // Not a number
        initialCarryoverMinutes: "invalid", // Not a number
        initialVacationCarryoverMinutes: "invalid", // Not a number
        color: 123 // Not a string
      });

      expect(contract.id).toBe("");
      expect(contract.user).toBe("");
      expect(contract.name).toBe("");
      expect(contract.minutes).toBe(0);
      expect(contract.percentFte).toBe(0.0);
      expect(contract.initialCarryoverMinutes).toBe(0);
      expect(contract.initialVacationCarryoverMinutes).toBe(0);
      expect(contract.color).toBe("#8ac5ff");
    });
  });

  describe("getters", () => {
    it("calculates duration correctly", () => {
      const contract = new Contract({
        startDate: "2021-01-01",
        endDate: "2021-01-31"
      });
      expect(contract.duration).toBe(30);
    });

    it("calculates remainingContractDuration correctly", () => {
      const now = new Date(2021, 0, 1);
      timekeeper.freeze(now);

      const contract = new Contract({
        startDate: "2021-01-01",
        endDate: "2021-01-31"
      });

      expect(contract.remainingContractDuration).toBe(30);
    });

    it("calculates minutesToHourRepresentation correctly", () => {
      const contract = new Contract({ minutes: 90 });
      expect(contract.minutesToHourRepresentation).toBe(1.5);

      const contract2 = new Contract({ minutes: 120 });
      expect(contract2.minutesToHourRepresentation).toBe(2);
    });
  });

  describe("methods", () => {
    it("formats startDateString correctly", () => {
      const contract = new Contract({
        startDate: "2021-01-01"
      });
      expect(contract.startDateString()).toBe("2021-01-01");
    });

    it("formats endDateString correctly", () => {
      const contract = new Contract({
        endDate: "2021-01-31"
      });
      expect(contract.endDateString()).toBe("2021-01-31");
    });

    it("generates worktimeRepresentation for studEmp correctly in format HH:mm", () => {
      const contract = new Contract({
        worktimeModelName: "studEmp",
        minutes: 120
      });
      expect(contract.worktimeRepresentation()).toBe("02:00 per month");
    });

    it("generates worktimeRepresentation for regEmp correctly", () => {
      const contract = new Contract({
        worktimeModelName: "regEmp",
        percentFte: 80
      });
      expect(contract.worktimeRepresentation()).toBe("80% per month");
    });

    it("converts to payload correctly", () => {
      const now = new Date(2021, 0, 1);
      timekeeper.freeze(now);
      const contract = new Contract({
        id: "1234",
        name: "Test Contract",
        reference: "ref123",
        minutes: 120,
        startDate: "2021-01-01",
        endDate: "2021-01-31",
        initialCarryoverMinutes: 60,
        initialVacationCarryoverMinutes: 30,
        lastUsed: "2021-01-15",
        color: "#ff0000",
        worktimeModelName: "studEmp",
        percentFte: 80
      });

      const payload = contract.toPayload();

      // Check all properties except last_used
      expect(payload.id).toBe("1234");
      expect(payload.name).toBe("Test Contract");
      expect(payload.reference).toBe("ref123");
      expect(payload.minutes).toBe(120);
      expect(payload.start_date).toBe("2021-01-01");
      expect(payload.end_date).toBe("2021-01-31");
      expect(payload.initial_carryover_minutes).toBe(60);
      expect(payload.initial_vacation_carryover_minutes).toBe(30);
      expect(payload.color).toBe("#ff0000");
      expect(payload.worktime_model_name).toBe("studEmp");
      expect(payload.percent_fte).toBe(80);

      // Check that last_used is a Date object
      expect(payload.last_used instanceof Date).toBe(true);
    });

    it("clones a contract correctly", () => {
      const original = new Contract({
        id: "1234",
        name: "Test Contract",
        minutes: 120,
        startDate: "2021-01-01",
        endDate: "2021-01-31"
      });

      const clone = original.clone();

      // Clone should be a new instance with the same values
      expect(clone).not.toBe(original);
      expect(clone.id).toBe(original.id);
      expect(clone.name).toBe(original.name);
      expect(clone.minutes).toBe(original.minutes);
      expect(clone.startDate.getTime()).toBe(original.startDate.getTime());
      expect(clone.endDate.getTime()).toBe(original.endDate.getTime());
    });
  });
});
