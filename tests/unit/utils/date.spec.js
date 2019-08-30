import { defaultContractDate } from "@/utils/date";

describe("Contracts/defaultContractDate()", () => {
  // Winter term tests
  it("returns correct start date for winter term given the starting edge", () => {
    expect(
      defaultContractDate({ type: "start", date: new Date(2018, 9, 1) })
    ).toEqual(new Date(2018, 9, 1));
  });

  it("returns correct start date for winter term", () => {
    expect(
      defaultContractDate({ type: "start", date: new Date(2019, 1, 1) })
    ).toEqual(new Date(2018, 9, 1));
  });

  it("returns correct end date for winter term given the ending edge", () => {
    expect(
      defaultContractDate({ type: "end", date: new Date(2019, 2, 31) })
    ).toEqual(new Date(2019, 2, 31));
  });

  it("returns correct end date for winter term", () => {
    expect(
      defaultContractDate({ type: "end", date: new Date(2019, 1, 1) })
    ).toEqual(new Date(2019, 2, 31));
  });

  // Summer term tests
  it("returns correct start date for summer term given the starting edge", () => {
    expect(
      defaultContractDate({ type: "start", date: new Date(2018, 3, 1) })
    ).toEqual(new Date(2018, 3, 1));
  });

  it("returns correct start date for summer term", () => {
    expect(
      defaultContractDate({ type: "start", date: new Date(2019, 5, 1) })
    ).toEqual(new Date(2019, 3, 1));
  });

  it("returns correct end date for summer term given the ending edge", () => {
    expect(
      defaultContractDate({ type: "end", date: new Date(2019, 8, 30) })
    ).toEqual(new Date(2019, 8, 30));
  });

  it("returns correct end date for summer term", () => {
    expect(
      defaultContractDate({ type: "end", date: new Date(2019, 5, 1) })
    ).toEqual(new Date(2019, 8, 30));
  });
});
